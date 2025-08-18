'use client';
import { WidgetView } from '@/modules/ui/views/widget-view';
import { use } from 'react';

interface Props {
        searchParams: Promise<{ organizationId: string }>;
}

const Page = ({ searchParams }: Props) => {
        const { organizationId } = use(searchParams);
        return (
                <div className="flex flex-col gap-4 items-center justify-center min-h-svh max-w-md mx-auto w-full">
                        <WidgetView organizationId={organizationId} />
                </div>
        );
};
export default Page;
