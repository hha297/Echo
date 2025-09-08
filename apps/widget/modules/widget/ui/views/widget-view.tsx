'use client';

import { useAtomValue } from 'jotai';

import { WidgetAuthScreen } from '../screens/widget-auth-screen';
import { screenAtom } from '../../atom/widget-atom';
import { WidgetErrorScreen } from '../screens/widget-error-screen';
import { WidgetLoadingScreen } from '../screens/widget-loading-screen';
import { WidgetSelectionScreen } from '../screens/widget-selection-screen';
import { WidgetChatScreen } from '../screens/widget-chat-screen';
import { WidgetInboxScreen } from '../screens/widget-inbox-screen';
import { WidgetVoiceScreen } from '../screens/widget-voice-screen';
import { WidgetContactScreen } from '../screens/widget-contact-screen';

interface WidgetViewProps {
        organizationId: string;
}
export const WidgetView = ({ organizationId }: WidgetViewProps) => {
        const screen = useAtomValue(screenAtom);
        const screenComponents = {
                loading: <WidgetLoadingScreen organizationId={organizationId} />,
                error: <WidgetErrorScreen />,
                auth: <WidgetAuthScreen />,
                voice: <WidgetVoiceScreen />,
                inbox: <WidgetInboxScreen />,
                selection: <WidgetSelectionScreen />,
                chat: <WidgetChatScreen />,
                contact: <WidgetContactScreen />,
        };
        return (
                <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden bg-muted">
                        {screenComponents[screen]}
                </main>
        );
};
