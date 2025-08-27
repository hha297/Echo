import { createTool } from '@convex-dev/agent';
import { internal } from '@workspace/backend/_generated/api';
import { z } from 'zod';
import { supportAgent } from '../agents/supportAgent';
import { ConvexError } from 'convex/values';

export const resolveConversation = createTool({
        description: 'Resolve a conversation',
        args: z.object({}),
        handler: async (ctx) => {
                if (!ctx.threadId) {
                        throw new ConvexError({
                                code: 'NOT_FOUND',
                                message: 'Thread not found',
                        });
                }

                await ctx.runMutation(internal.system.conversation.resolve, {
                        threadId: ctx.threadId,
                });

                await supportAgent.saveMessage(ctx, {
                        threadId: ctx.threadId,
                        message: {
                                role: 'assistant',
                                content: 'Conversation resolved',
                        },
                });

                return 'Conversation resolved';
        },
});
