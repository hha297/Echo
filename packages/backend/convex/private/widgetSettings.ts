import { ConvexError, v } from 'convex/values';
import { mutation, query } from '../_generated/server';

export const getOne = query({
        args: {},
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
                const widgetSettings = await ctx.db
                        .query('widgetSettings')
                        .withIndex('by_organization_id', (q) => q.eq('organizationId', orgId))
                        .unique();

                return widgetSettings;
        },
});

export const upsert = mutation({
        args: {
                greetMessage: v.string(),
                defaultSuggestions: v.object({
                        suggestion1: v.optional(v.string()),
                        suggestion2: v.optional(v.string()),
                        suggestion3: v.optional(v.string()),
                }),
                vapiSettings: v.object({
                        assistantId: v.optional(v.string()),
                        phoneNumbers: v.optional(v.string()),
                }),
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
                const existingWidgetSettings = await ctx.db
                        .query('widgetSettings')
                        .withIndex('by_organization_id', (q) => q.eq('organizationId', orgId))
                        .unique();

                if (existingWidgetSettings) {
                        await ctx.db.patch(existingWidgetSettings._id, args);
                } else {
                        await ctx.db.insert('widgetSettings', {
                                ...args,
                                organizationId: orgId,
                        });
                }
        },
});
