import { openai } from '@ai-sdk/openai';
import { createTool } from '@convex-dev/agent';
import { generateText } from 'ai';
import { internal } from '@workspace/backend/_generated/api';
import { supportAgent } from '../agents/supportAgent';
import { rag } from '../rag';
import { z } from 'zod';
import { ConvexError } from 'convex/values';
import { SEARCH_INTERPRETER_PROMPT } from '../constants';

export const search = createTool({
        description: 'Search the knowledge base for relevant information to help the user with their question',
        args: z.object({
                query: z.string().describe('The search query to find relevant information'),
        }),
        handler: async (ctx, args) => {
                if (!ctx.threadId) {
                        return 'Thread not found';
                }
                const conversation = await ctx.runQuery(internal.system.conversation.getByThreadId, {
                        threadId: ctx.threadId,
                });
                if (!conversation) {
                        return 'Conversation not found';
                }

                const orgId = conversation.organizationId;
                const searchResults = await rag.search(ctx, {
                        query: args.query,
                        namespace: orgId,
                        limit: 5,
                });

                const contextText = `Found result in ${searchResults.entries
                        .map((e) => e.title || null)
                        .filter((t) => t !== null)
                        .join(', ')}. Here are the results: ${searchResults.text}`;

                const response = await generateText({
                        model: openai.chat('gpt-4o-mini'),
                        messages: [
                                {
                                        role: 'system',
                                        content: SEARCH_INTERPRETER_PROMPT,
                                },
                                {
                                        role: 'user',
                                        content: `User's question: "${args.query}"\n\nSearch results: ${contextText}`,
                                },
                        ],
                });

                await supportAgent.saveMessage(ctx, {
                        threadId: ctx.threadId,
                        message: {
                                role: 'assistant',
                                content: response.text,
                        },
                });

                return response.text;
        },
});
