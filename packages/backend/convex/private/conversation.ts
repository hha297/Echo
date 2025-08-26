import { ConvexError, v } from 'convex/values';
import { query } from '../_generated/server.js';
import { supportAgent } from '../system/ai/agents/supportAgent.js';
import { MessageDoc } from '@convex-dev/agent';

import { paginationOptsValidator, PaginationResult } from 'convex/server';
import { Doc } from '../_generated/dataModel.js';

export const getOne = query({
        args: {
                conversationId: v.id('conversation'),
        },
        handler: async (ctx, args) => {
                const identity = await ctx.auth.getUserIdentity();

                if (identity === null) {
                        throw new ConvexError({
                                code: 'Unauthorized',
                                message: 'Identity Not Found',
                        });
                }

                const orgId = identity.orgId as string;

                if (!orgId) {
                        throw new ConvexError({
                                code: 'Unauthorized',
                                message: 'Organization Not Found',
                        });
                }

                const conversation = await ctx.db.get(args.conversationId);

                if (!conversation) {
                        throw new ConvexError({
                                code: 'NOT_FOUND',
                                message: 'Conversation Not Found',
                        });
                }

                if (conversation.organizationId !== orgId) {
                        throw new ConvexError({
                                code: 'UNAUTHORIZED',
                                message: 'Invalid Organization ID',
                        });
                }

                const contactSession = await ctx.db.get(conversation.contactSessionId);
                if (!contactSession) {
                        throw new ConvexError({
                                code: 'NOT_FOUND',
                                message: 'Contact Session Not Found',
                        });
                }

                return {
                        ...conversation,
                        contactSession,
                };
        },
});
export const getMany = query({
        args: {
                paginationOpts: paginationOptsValidator,
                status: v.optional(v.union(v.literal('unresolved'), v.literal('escalated'), v.literal('resolved'))),
        },
        handler: async (ctx, args) => {
                const identity = await ctx.auth.getUserIdentity();

                if (identity === null) {
                        throw new ConvexError({
                                code: 'UNAUTHORIZED',
                                message: 'Identity Not Found',
                        });
                }

                const orgId = identity.orgId as string;

                if (!orgId) {
                        throw new ConvexError({
                                code: 'UNAUTHORIZED',
                                message: 'Organization Not Found',
                        });
                }

                let conversations: PaginationResult<Doc<'conversation'>>;

                if (args.status) {
                        conversations = await ctx.db
                                .query('conversation')
                                .withIndex('by_status_and_organization_id', (q) =>
                                        q
                                                .eq('status', args.status as Doc<'conversation'>['status'])
                                                .eq('organizationId', orgId),
                                )
                                .order('desc')
                                .paginate(args.paginationOpts);
                } else {
                        conversations = await ctx.db
                                .query('conversation')
                                .withIndex('by_organization_id', (q) => q.eq('organizationId', orgId))
                                .order('desc')
                                .paginate(args.paginationOpts);
                }

                const conversationsWithAdditionalData = await Promise.all(
                        conversations.page.map(async (conversation) => {
                                let lastMessage: MessageDoc | null = null;

                                const contactSession = await ctx.db.get(conversation.contactSessionId);

                                if (!contactSession) {
                                        return null;
                                }

                                const messages = await supportAgent.listMessages(ctx, {
                                        threadId: conversation.threadId,
                                        paginationOpts: { numItems: 1, cursor: null },
                                });

                                if (messages.page.length > 0) {
                                        lastMessage = messages.page[0] ?? null;
                                }

                                return {
                                        ...conversation,
                                        lastMessage,
                                        contactSession,
                                };
                        }),
                );

                const validConversation = conversationsWithAdditionalData.filter(
                        (conversation): conversation is NonNullable<typeof conversation> => conversation !== null,
                );

                return {
                        ...conversations,
                        page: validConversation,
                };
        },
});
