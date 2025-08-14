import { v } from 'convex/values';
import { mutation, query } from './_generated/server.js';

export const getMany = query({
        args: {},
        handler: async (ctx) => {
                return await ctx.db.query('users').collect();
        },
});

export const addUser = mutation({
        args: {},
        handler: async (ctx, args) => {
                const identity = await ctx.auth.getUserIdentity();
                if (identity === null) {
                        throw new Error('Unauthorized');
                }
                const orgId = identity.orgId as string;

                if (!orgId) {
                        throw new Error('Organization ID is required');
                }

                return await ctx.db.insert('users', { name: 'Test' });
        },
});
