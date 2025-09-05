import { ArrowLeftIcon, MicIcon, MicOffIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

import {
        AIConversation,
        AIConversationContent,
        AIConversationScrollButton,
} from '@workspace/ui/components/ai/conversation';
import { AIMessage, AIMessageContent } from '@workspace/ui/components/ai/message';
import { useVapi } from '../../hooks/use-vapi';
import { WidgetHeader } from '../components/widget-header';
import { useSetAtom } from 'jotai';
import { screenAtom } from '../../atom/widget-atom';

import { cn } from '@workspace/ui/lib/utils';

export const WidgetVoiceScreen = () => {
        const setScreen = useSetAtom(screenAtom);
        const { vapi, isConnected, isConnecting, isSpeaking, transcript, startCall, endCall } = useVapi();
        return (
                <>
                        <WidgetHeader>
                                <div className="flex items-center gap-x-2">
                                        <Button
                                                variant={'transparent'}
                                                size={'icon'}
                                                onClick={() => setScreen('selection')}
                                        >
                                                <ArrowLeftIcon />
                                        </Button>
                                        <p>Voice Chat</p>
                                </div>
                        </WidgetHeader>
                        {transcript.length > 0 ? (
                                <AIConversation className="h-full flex-1 overflow-y-auto">
                                        <AIConversationContent>
                                                {transcript.map((message, index) => (
                                                        <AIMessage
                                                                key={`${message.role}-${index}-${message.text}`}
                                                                from={message.role}
                                                        >
                                                                {message.text}
                                                        </AIMessage>
                                                ))}
                                        </AIConversationContent>
                                        <AIConversationScrollButton />
                                </AIConversation>
                        ) : (
                                <div className="flex flex-1 h-full flex-col items-center justify-center gap-y-4">
                                        <div className="flex items-center justify-center rounded-full border bg-white p-3">
                                                <MicIcon className="size-6 text-muted-foreground" />
                                        </div>
                                        <p>Transcript will appear here</p>
                                </div>
                        )}
                        <div className="border-t bg-background p-4">
                                <div className="flex flex-col items-center gap-y-4">
                                        {isConnected && (
                                                <div className="flex items-center gap-x-2">
                                                        <div
                                                                className={cn(
                                                                        'size-3 rounded-full bg-green-500',
                                                                        isSpeaking && 'bg-red-500 animate-pulse',
                                                                )}
                                                        />
                                                        <span className="text-sm text-muted-foreground">
                                                                {isSpeaking ? 'Assistant speaking...' : 'Listening...'}
                                                        </span>
                                                </div>
                                        )}
                                        <div className="flex w-full justify-center">
                                                {isConnected ? (
                                                        <Button
                                                                onClick={() => endCall()}
                                                                disabled={isConnecting}
                                                                size="lg"
                                                                className="w-full"
                                                                variant={'destructive'}
                                                        >
                                                                <MicOffIcon />
                                                                End Call
                                                        </Button>
                                                ) : (
                                                        <Button
                                                                onClick={() => startCall()}
                                                                disabled={isConnecting}
                                                                size="lg"
                                                                className="w-full"
                                                        >
                                                                <MicIcon />
                                                                Start Call
                                                        </Button>
                                                )}
                                        </div>
                                </div>
                        </div>
                </>
        );
};
