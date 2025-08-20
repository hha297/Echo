'use client';

import { useAtomValue } from 'jotai';

import { WidgetAuthScreen } from '../screens/widget-auth-screen';
import { screenAtom } from '../../atom/widget-atom';

interface WidgetViewProps {
        organizationId: string;
}
export const WidgetView = ({ organizationId }: WidgetViewProps) => {
        const screen = useAtomValue(screenAtom);
        const screenComponents = {
                error: <p>TODO: error</p>,
                loading: <p>TODO: loading</p>,
                auth: <WidgetAuthScreen />,
                voice: <p>TODO: voice</p>,
                inbox: <p>TODO: inbox</p>,
                selection: <p>TODO: selection</p>,
                chat: <p>TODO: chat</p>,
                contact: <p>TODO: contact</p>,
        };
        return (
                <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden bg-muted">
                        {screenComponents[screen]}
                </main>
        );
};
