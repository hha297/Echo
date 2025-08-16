'use client';
import { useVapi } from '@/modules/hooks/use-vapi';
import { Button } from '@workspace/ui/components/button';

export default function Page() {
        const { isSpeaking, isConnecting, isConnected, transcript, startCall, endCall } = useVapi();
        return (
                <div className="flex flex-col gap-4 items-center justify-center min-h-svh max-w-md mx-auto w-full">
                        <Button onClick={() => startCall()}>Start Call</Button>
                        <Button onClick={() => endCall()} variant={'destructive'}>
                                End Call
                        </Button>
                        <p>IsConnected: {isConnected}</p>
                        <p>IsConnecting: {isConnecting}</p>

                        <p>{JSON.stringify(transcript)}</p>
                </div>
        );
}
