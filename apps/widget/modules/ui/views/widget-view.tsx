'use client';

import { WidgetFooter } from '../components/widget-footer';
import { WidgetHeader } from '../components/widget-header';
import { WidgetAuthScreen } from '../screens/widget-auth-screen';

interface WidgetViewProps {
        organizationId: string;
}
export const WidgetView = ({ organizationId }: WidgetViewProps) => {
        return (
                <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden bg-muted">
                        <WidgetAuthScreen />
                        {/* <WidgetFooter /> */}
                </main>
        );
};
