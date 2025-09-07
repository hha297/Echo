import { ConvexError, v } from 'convex/values';
import { query } from '../_generated/server';

export const getOneByConversationId = query({
        args: {
                conversationId: v.id('conversation'),
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

                return contactSession;
        },
});
