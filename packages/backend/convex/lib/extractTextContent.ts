import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import type { StorageActionWriter } from 'convex/server';
import { assert } from 'convex-helpers';
import { Id } from '../_generated/dataModel';

const AI_MODELS = {
        image: openai.chat('gpt-4o-mini'),
        pdf: openai.chat('gpt-4o'),
        html: openai.chat('gpt-4o'),
} as const;

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'] as const;
const SYSTEM_PROMPT = {
        image: 'You turn images into text. You are given an image and you need to extract the text from it. If it is a photo of the document, you need to extract / transcribe the text from it. If it is not a document, describe the image in detail. You need to return the text in the same language as the image.',
        pdf: 'You turn pdf into text. You are given a pdf and you need to extract the text from it. You are also given the mime type of the pdf. You need to return the text in the same language as the pdf.',
        html: 'You turn html into markdown. You are given an html and you need to extract the text from it. You are also given the mime type of the html. You need to return the text in the same language as the html.',
};

export type ExtractTextContentArgs = {
        storageId: Id<'_storage'>;
        fileName: string;
        bytes?: ArrayBuffer;
        mimeType: string;
};

export async function extractTextContent(
        ctx: { storage: StorageActionWriter },
        args: ExtractTextContentArgs,
): Promise<string> {
        const { storageId, fileName, bytes, mimeType } = args;

        const url = await ctx.storage.getUrl(storageId);
        assert(url, 'Storage URL not found');

        if (SUPPORTED_IMAGE_TYPES.some((type) => type === mimeType)) {
                return extractImageText(url);
        }

        if (mimeType.toLowerCase().includes('pdf')) {
                return extractPdfText(url, mimeType, fileName);
        }

        if (mimeType.toLowerCase().includes('text')) {
                return extractTextFileContent(ctx, storageId, bytes, mimeType);
        }

        throw new Error(`Unsupported mime type: ${mimeType}`);
}

async function extractTextFileContent(
        ctx: { storage: StorageActionWriter },
        storageId: Id<'_storage'>,
        bytes: ArrayBuffer | undefined,
        mimeType: string,
): Promise<string> {
        const url = await ctx.storage.getUrl(storageId);
        assert(url, 'Storage URL not found');

        const arrayBuffer = bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());

        if (!arrayBuffer) {
                throw new Error('Failed to get file content');
        }

        const text = new TextDecoder().decode(arrayBuffer);

        if (mimeType.toLowerCase() !== 'text/plain') {
                const result = await generateText({
                        model: AI_MODELS.html,
                        system: SYSTEM_PROMPT.html,
                        messages: [
                                {
                                        role: 'user',
                                        content: [
                                                { type: 'text', text: text },
                                                {
                                                        type: 'text',
                                                        text: 'Extract the text from the file and print it without explaining what you did. Return the text in the same language as the file.',
                                                },
                                        ],
                                },
                        ],
                });

                return result.text;
        }

        return text;
}

async function extractPdfText(url: string, mimeType: string, fileName: string): Promise<string> {
        const result = await generateText({
                model: AI_MODELS.pdf,
                system: SYSTEM_PROMPT.pdf,
                messages: [
                        {
                                role: 'user',
                                content: [
                                        { type: 'file', data: new URL(url), mimeType, filename: fileName },
                                        {
                                                type: 'text',
                                                text: 'Extract the text from the pdf and print it without explaining what you did. Return the text in the same language as the pdf.',
                                        },
                                ],
                        },
                ],
        });

        return result.text;
}

async function extractImageText(url: string): Promise<string> {
        const result = await generateText({
                model: AI_MODELS.image,
                system: SYSTEM_PROMPT.image,
                messages: [{ role: 'user', content: [{ type: 'image', image: new URL(url) }] }],
        });

        return result.text;
}
