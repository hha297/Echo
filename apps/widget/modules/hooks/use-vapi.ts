import Vapi from '@vapi-ai/web';
import { useEffect, useState } from 'react';

interface TranscriptMessage {
        role: 'user' | 'assistant';
        text: string;
}

export const useVapi = () => {
        const [vapi, setVapi] = useState<Vapi | null>(null);
        const [isConnected, setIsConnected] = useState(false);
        const [isConnecting, setIsConnecting] = useState(false);
        const [isSpeaking, setIsSpeaking] = useState(false);
        const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

        useEffect(() => {
                // Only for testing purposes, users / customers will replace with their own actual API token
                const vapiInstance = new Vapi('13287e62-56f6-4497-8810-efb26c373a83');
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
                setIsConnecting(true);

                // Only for testing purposes, users / customers will replace with their own Assistant ID
                if (vapi) {
                        vapi.start('9c805a51-0104-4d63-8ac1-607bef9a2681');
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
