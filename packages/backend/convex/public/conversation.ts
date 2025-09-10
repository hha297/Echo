import { ConvexError, v } from 'convex/values';
import { mutation, query } from '../_generated/server.js';
import { supportAgent } from '../system/ai/agents/supportAgent.js';
import { MessageDoc, saveMessage } from '@convex-dev/agent';
import { components, internal } from '../_generated/api.js';
import { paginationOptsValidator } from 'convex/server';

export const getMany = query({
        args: {
                contactSessionId: v.id('contactSession'),
                paginationOpts: paginationOptsValidator,
        },
        handler: async (ctx, args) => {
                const contactSession = await ctx.db.get(args.contactSessionId);

                if (!contactSession || contactSession.expiresAt < Date.now()) {
                        throw new ConvexError({
                                code: 'UNAUTHORIZED',
                                message: 'Invalid Session',
                        });
                }

                const conversations = await ctx.db
                        .query('conversation')
                        .withIndex('by_contact_session_id', (q) => q.eq('contactSessionId', args.contactSessionId))
                        .order('desc')
                        .paginate(args.paginationOpts);

                const conversationWithLastMessage = await Promise.all(
                        conversations.page.map(async (conversation) => {
                                let lastMessage: MessageDoc | null = null;
                                const messages = await supportAgent.listMessages(ctx, {
                                        threadId: conversation.threadId,
                                        paginationOpts: { numItems: 1, cursor: null },
                                });

                                if (messages.page.length > 0) {
                                        lastMessage = messages.page[0] ?? null;
                                }

                                return {
                                        _id: conversation._id,
                                        _creationTime: conversation._creationTime,
                                        status: conversation.status,
                                        organizationId: conversation.organizationId,
                                        threadId: conversation.threadId,
                                        lastMessage,
                                };
                        }),
                );

                return {
                        ...conversations,
                        page: conversationWithLastMessage,
                };
        },
});

export const getOne = query({
        args: {
                conversationId: v.id('conversation'),
                contactSessionId: v.id('contactSession'),
        },
        handler: async (ctx, args) => {
                const session = await ctx.db.get(args.contactSessionId);

                if (!session || session.expiresAt < Date.now()) {
                        throw new ConvexError({
                                code: 'UNAUTHORIZED',
                                message: 'Invalid Session',
                        });
                }

                const conversation = await ctx.db.get(args.conversationId);

                if (!conversation) {
                        throw new ConvexError({
                                code: 'NOT_FOUND',
                                message: 'Conversation Not Found',
                        });
                }

                if (conversation.contactSessionId !== session._id) {
                        throw new ConvexError({
                                code: 'UNAUTHORIZED',
                                message: 'Incorrect Session',
                        });
                }

                return {
                        _id: conversation._id,
                        status: conversation.status,
                        threadId: conversation.threadId,
                };
        },
});

export const create = mutation({
        args: {
                organizationId: v.string(),
                contactSessionId: v.id('contactSession'),
        },
        handler: async (ctx, args) => {
                const session = await ctx.db.get(args.contactSessionId);

                if (!session || session.expiresAt < Date.now()) {
                        throw new ConvexError({
                                code: 'UNAUTHORIZED',
                                message: 'Invalid Session',
                        });
                }

                // Refresh the contact session to extend the session duration
                await ctx.runMutation(internal.system.contactSession.refresh, {
                        contactSessionId: args.contactSessionId,
                });

                const widgetSettings = await ctx.db
                        .query('widgetSettings')
                        .withIndex('by_organization_id', (q) => q.eq('organizationId', args.organizationId))
                        .unique();

                const { threadId } = await supportAgent.createThread(ctx, { userId: args.organizationId });

                await saveMessage(ctx, components.agent, {
                        threadId: threadId,
                        message: {
                                role: 'assistant',

                                content: widgetSettings?.greetMessage || 'Hello, how can I help you today?.',
                        },
                });
                const conversationId = await ctx.db.insert('conversation', {
                        contactSessionId: session._id,
                        status: 'unresolved',
                        organizationId: args.organizationId,
                        threadId,
                });

                return conversationId;
        },
});
