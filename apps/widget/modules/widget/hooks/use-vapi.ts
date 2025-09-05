import Vapi from '@vapi-ai/web';
import { useEffect, useState } from 'react';
import { vapiSecretAtom, widgetSettingsAtom } from '../atom/widget-atom';
import { useAtomValue } from 'jotai';

interface TranscriptMessage {
        role: 'user' | 'assistant';
        text: string;
}

export const useVapi = () => {
        const vapiSecret = useAtomValue(vapiSecretAtom);
        const widgetSettings = useAtomValue(widgetSettingsAtom);

        const [vapi, setVapi] = useState<Vapi | null>(null);
        const [isConnected, setIsConnected] = useState(false);
        const [isConnecting, setIsConnecting] = useState(false);
        const [isSpeaking, setIsSpeaking] = useState(false);
        const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

        useEffect(() => {
                if (!vapiSecret) return;

                const vapiInstance = new Vapi(vapiSecret.publicApiKey);
                setVapi(vapiInstance);

                vapiInstance.on('call-start', () => {
                        setIsConnected(true);
                        setIsConnecting(false);
                        setTranscript([]);
                });

                vapiInstance.on('call-end', () => {
                        setIsConnected(false);
                        setIsConnecting(false);
                        setIsSpeaking(false);
                });

                vapiInstance.on('speech-start', () => {
                        setIsSpeaking(true);
                });
                vapiInstance.on('speech-end', () => {
                        setIsSpeaking(false);
                });

                vapiInstance.on('error', (error) => {
                        console.error('Vapi error:', error);
                        setIsConnected(false);
                        setIsConnecting(false);
                });

                vapiInstance.on('message', (message) => {
                        if (message.type === 'transcript' && message.transcriptType === 'final') {
                                setTranscript((prev) => [
                                        ...prev,
                                        {
                                                role: message.role === 'user' ? 'user' : 'assistant',
                                                text: message.transcript,
                                        },
                                ]);
                        }
                });

                return () => {
                        vapiInstance?.stop();
                };
        }, []);

        const startCall = () => {
                if (!vapiSecret || !widgetSettings?.vapiSettings?.assistantId) return;
                setIsConnecting(true);

                if (vapi) {
                        vapi.start(widgetSettings.vapiSettings.assistantId);
                }
        };

        const endCall = () => {
                if (vapi) {
                        vapi.stop();
                }
        };

        return {
                vapi,
                isConnected,
                isConnecting,
                isSpeaking,
                transcript,
                startCall,
                endCall,
        };
};
