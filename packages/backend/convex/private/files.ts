import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';
import { action, mutation, query, QueryCtx } from '../_generated/server';
import {
        contentHashFromArrayBuffer,
        Entry,
        EntryId,
        guessMimeTypeFromContents,
        guessMimeTypeFromExtension,
        vEntryId,
} from '@convex-dev/rag';
import { extractTextContent } from '../lib/extractTextContent';
import { rag } from '../system/ai/rag';
import { Id } from '../_generated/dataModel';
import { internal } from '../_generated/api';

function guessMimeType(fileName: string, bytes: ArrayBuffer): string {
        return guessMimeTypeFromExtension(fileName) || guessMimeTypeFromContents(bytes) || 'application/octet-stream';
}

export const addFile = action({
        args: {
                fileName: v.string(),
                mimeType: v.string(),
                bytes: v.bytes(),
                category: v.optional(v.string()),
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

                const subscription = await ctx.runQuery(internal.system.subscription.getByOrganizationId, {
                        organizationId: orgId,
                });
                if (subscription?.status !== 'active') {
                        throw new ConvexError({
                                code: 'BAD_REQUEST',
                                message: 'Subscription not active',
                        });
                }

                const { bytes, fileName, category } = args;
                const mimeType = args.mimeType || guessMimeType(fileName, bytes);
                const blob = new Blob([bytes], { type: mimeType });
                const storageId = await ctx.storage.store(blob);
                const text = await extractTextContent(ctx, {
                        storageId,
                        mimeType,
                        fileName,
                        bytes,
                });

                const { entryId, created } = await rag.add(ctx, {
                        namespace: orgId,
                        text,
                        key: fileName,
                        title: fileName,
                        metadata: {
                                storageId,
                                uploadedBy: orgId,
                                fileName,
                                category: category || '',
                        } as EntryMetadata,
                        contentHash: await contentHashFromArrayBuffer(bytes), // To avoid duplicates
                });

                if (!created) {
                        console.debug('Entry already exists, skipping upload metadata');
                        await ctx.storage.delete(storageId);
                }

                return {
                        url: await ctx.storage.getUrl(storageId),
                        entryId,
                };
        },
});

export const deleteFile = mutation({
        args: {
                entryId: vEntryId,
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

                const namespace = await rag.getNamespace(ctx, { namespace: orgId });

                if (!namespace) {
                        throw new ConvexError({
                                code: 'UNAUTHORIZED',
                                message: 'Invalid namespace',
                        });
                }

                const entry = await rag.getEntry(ctx, {
                        entryId: args.entryId,
                });

                if (!entry) {
                        throw new ConvexError({
                                code: 'NOT_FOUND',
                                message: 'Entry Not Found',
                        });
                }

                if (entry.metadata?.uploadedBy !== orgId) {
                        throw new ConvexError({
                                code: 'UNAUTHORIZED',
                                message: 'Invalid organization',
                        });
                }

                if (entry.metadata?.storageId) {
                        await ctx.storage.delete(entry.metadata.storageId as Id<'_storage'>);
                }

                await rag.deleteAsync(ctx, {
                        entryId: args.entryId,
                });
        },
});

export const list = query({
        args: {
                category: v.optional(v.string()),
                paginationOpts: paginationOptsValidator,
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

                const namespace = await rag.getNamespace(ctx, { namespace: orgId });

                if (!namespace) {
                        return { page: [], isDone: true, continueCursor: '' };
                }

                const results = await rag.list(ctx, {
                        namespaceId: namespace.namespaceId,

                        paginationOpts: args.paginationOpts,
                });

                const files = await Promise.all(results.page.map((entry) => convertEntrytoPublicFile(ctx, entry)));

                const filteredFiles = args.category ? files.filter((file) => file.category === args.category) : files;

                return {
                        page: filteredFiles,
                        isDone: results.isDone,
                        continueCursor: results.continueCursor,
                };
        },
});

export type PublicFile = {
        id: EntryId;
        name: string;
        type: string;
        size: string;
        status: 'ready' | 'processing' | 'error';
        url: string | null;
        category?: string;
};

type EntryMetadata = {
        storageId: Id<'_storage'>;
        uploadedBy: string;
        fileName: string;
        category: string | null;
};

async function convertEntrytoPublicFile(ctx: QueryCtx, entry: Entry): Promise<PublicFile> {
        const metadata = entry.metadata as EntryMetadata | undefined;
        const storageId = metadata?.storageId;
        let fileSize = 'unknown';

        if (storageId) {
                try {
                        const storageMetadata = await ctx.db.system.get(storageId);
                        if (storageMetadata) {
                                fileSize = formatFileSize(storageMetadata.size);
                        }
                } catch (error) {
                        console.error('Error getting storage metadata', error);
                }
        }

        const filename = entry.key || 'unknown';
        const extension = filename.split('.').pop()?.toLowerCase() || 'txt';

        let status: 'ready' | 'processing' | 'error' = 'error';
        if (entry.status === 'ready') {
                status = 'ready';
        } else if (entry.status === 'pending') {
                status = 'processing';
        }

        const url = storageId ? await ctx.storage.getUrl(storageId) : null;

        return {
                id: entry.entryId,
                name: filename,
                type: extension,
                size: fileSize,
                status,
                url,
                category: metadata?.category || undefined,
        };
}

function formatFileSize(bytes: number): string {
        if (bytes === 0) return '0B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
