'use client';

import { useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Loader2Icon } from 'lucide-react';
import CustomizationForm from '../components/customization-form';

export const CustomizationView = () => {
        const widgetSettings = useQuery(api.private.widgetSettings.getOne);
        const vapiPlugin = useQuery(api.private.plugins.getOne, {
                service: 'vapi',
        });

        if (widgetSettings === undefined || vapiPlugin === undefined) {
                return (
                        <div className="min-h-screen flex flex-col items-center justify-center gap-y-2 bg-muted p-8">
                                <Loader2Icon className="size-10 animate-spin" />
                                <p className="text-lg font-medium">No widget settings found</p>
                        </div>
                );
        }

        return (
                <div className="flex min-h-screen flex-col bg-muted p-8">
                        <div className="max-w-screen-md mx-auto w-full">
                                <div className="flex flex-col gap-4">
                                        <h1 className="text-2xl md:text-4xl font-bold">Widget Customization</h1>
                                        <p className="text-muted-foreground">
                                                Customize how your chat widget looks and behaves for your customers
                                        </p>
                                </div>
                                <div className="mt-8 ">
                                        <CustomizationForm initialData={widgetSettings} hasVapiPlugin={!!vapiPlugin} />
                                </div>
                        </div>
                </div>
        );
};
