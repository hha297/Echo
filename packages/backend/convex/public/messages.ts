import { ConvexError, v } from 'convex/values';
import { action, query } from '../_generated/server';
import { components, internal } from '../_generated/api';
import { supportAgent } from '../system/ai/agents/supportAgent';
import { paginationOptsValidator } from 'convex/server';
import { resolveConversation } from '../system/ai/tools/resolveConversation';
import { escalateConversation } from '../system/ai/tools/escalateConversation';
import { saveMessage } from '@convex-dev/agent';
import { search } from '../system/ai/tools/search';

export const create = action({
        args: {
                prompt: v.string(),
                threadId: v.string(),
                contactSessionId: v.id('contactSession'),
        },
        handler: async (ctx, args) => {
                const contactSession = await ctx.runQuery(internal.system.contactSession.getOne, {
                        contactSessionId: args.contactSessionId,
                });

                if (!contactSession || contactSession.expiresAt < Date.now()) {
                        throw new ConvexError({
                                code: 'UNAUTHORIZED',
                                message: 'Invalid session',
                        });
                }

                const conversation = await ctx.runQuery(internal.system.conversation.getByThreadId, {
                        threadId: args.threadId,
                });

                if (!conversation) {
                        throw new ConvexError({
                                code: 'NOT_FOUND',
                                message: 'Conversation Not Found',
                        });
                }

                if (conversation.status === 'resolved') {
                        throw new ConvexError({
                                code: 'BAD_REQUEST',
                                message: 'Conversation resolved',
                        });
                }

                // Refresh the contact session to extend the session duration
                await ctx.runMutation(internal.system.contactSession.refresh, {
                        contactSessionId: args.contactSessionId,
                });

                const subscription = await ctx.runQuery(internal.system.subscription.getByOrganizationId, {
                        organizationId: conversation.organizationId,
                });

                const shouldTriggerAgent = conversation.status === 'unresolved' && subscription?.status === 'active';
                if (shouldTriggerAgent) {
                        await supportAgent.generateText(
                                ctx,
                                { threadId: args.threadId },
                                {
                                        prompt: args.prompt,
                                        tools: {
                                                resolveConversationTool: resolveConversation,
                                                escalateConversationTool: escalateConversation,
                                                searchTool: search,
                                        },
                                },
                        );
                } else {
                        await saveMessage(ctx, components.agent, {
                                threadId: args.threadId,
                                prompt: args.prompt,
                        });
                }
        },
});

export const getMany = query({
        args: {
                threadId: v.string(),
                paginationOpts: paginationOptsValidator,
                contactSessionId: v.id('contactSession'),
        },
        handler: async (ctx, args) => {
                const contactSession = await ctx.db.get(args.contactSessionId);

                if (!contactSession || contactSession.expiresAt < Date.now()) {
                        throw new ConvexError({
                                code: 'UNAUTHORIZED',
                                message: 'Invalid session',
                        });
                }

                const paginated = await supportAgent.listMessages(ctx, {
                        threadId: args.threadId,
                        paginationOpts: args.paginationOpts,
                });

                return paginated;
        },
});
