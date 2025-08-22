import { ConvexError, v } from 'convex/values';
import { mutation, query } from '../_generated/server.js';
import { supportAgent } from '../system/ai/agents/supportAgent.js';
import { saveMessage } from '@convex-dev/agent';
import { components } from '../_generated/api.js';

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

                const { threadId } = await supportAgent.createThread(ctx, { userId: args.organizationId });

                await saveMessage(ctx, components.agent, {
                        threadId: threadId,
                        message: {
                                role: 'assistant',
                                // TODO: Modify to change with settings
                                content: 'Hello, how can I help you today?.',
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
