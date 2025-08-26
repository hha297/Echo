import { ConversationIdView } from '@/modules/dashboard/ui/views/conversation-id-view';
import { Id } from '@workspace/backend/_generated/dataModel';
import React from 'react';

const ConversationIdPage = async ({ params }: { params: Promise<{ conversationId: string }> }) => {
        const { conversationId } = await params;

        return <ConversationIdView conversationId={conversationId as Id<'conversation'>} />;
};

export default ConversationIdPage;
