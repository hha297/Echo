'use client';

import { WidgetFooter } from '../components/widget-footer';
import { WidgetHeader } from '../components/widget-header';

interface WidgetViewProps {
        organizationId: string;
}
export const WidgetView = ({ organizationId }: WidgetViewProps) => {
        return (
                <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden bg-muted">
                        <WidgetHeader>
                                <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                                        <p className="font-semibold text-3xl">Hi there! </p>
                                        <p className="font-semibold text-lg">How can we help you today?</p>
                                </div>
                        </WidgetHeader>
                        <div className="flex flex-1">WidgetView {organizationId}</div>
                        <WidgetFooter />
                </main>
        );
};
