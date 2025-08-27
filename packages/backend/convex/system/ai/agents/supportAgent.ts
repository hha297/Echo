import { openai } from '@ai-sdk/openai';
import { Agent } from '@convex-dev/agent';
import { components } from '../../../_generated/api';

export const supportAgent = new Agent(components.agent, {
        chat: openai.chat('gpt-4o-mini'),
        instructions: `You are customer support agent. Use "resolveConversation" tool when user express finalization of the conversation. Use "escalateConversation" tool when user frustrate, angry, sad, or request a higher level of support.`,
});
