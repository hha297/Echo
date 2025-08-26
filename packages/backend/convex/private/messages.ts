import { ConvexError, v } from 'convex/values';
import { action, mutation, query } from '../_generated/server';
import { components, internal } from '../_generated/api';
import { supportAgent } from '../system/ai/agents/supportAgent';
import { paginationOptsValidator } from 'convex/server';
import { saveMessage } from '@convex-dev/agent';

export const create = mutation({
        args: {
                prompt: v.string(),
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

                if (conversation.status === 'resolved') {
                        throw new ConvexError({
                                code: 'BAD_REQUEST',
                                message: 'Conversation resolved',
                        });
                }

                await saveMessage(ctx, components.agent, {
                        threadId: conversation.threadId,
                        // TODO: Check agentsName
                        agentName: identity.givenName,
                        message: {
                                role: 'assistant',
                                content: args.prompt,
                        },
                });
        },
});

export const getMany = query({
        args: {
                threadId: v.string(),
                paginationOpts: paginationOptsValidator,
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

                const conversation = await ctx.db
                        .query('conversation')
                        .withIndex('by_thread_id', (q) => q.eq('threadId', args.threadId))
                        .unique();

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

                const paginated = await supportAgent.listMessages(ctx, {
                        threadId: args.threadId,
                        paginationOpts: args.paginationOpts,
                });

                return paginated;
        },
});
