import { v } from 'convex/values';
import { mutation, query } from './_generated/server.js';

export const getMany = query({
        args: {},
        handler: async (ctx) => {
                return await ctx.db.query('users').collect();
        },
});

export const addUser = mutation({
        args: { name: v.string() },
        handler: async (ctx, args) => {
                const user = { name: args.name };
                return await ctx.db.insert('users', user);
        },
});
