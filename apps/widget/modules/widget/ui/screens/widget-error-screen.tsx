'use client';

import { useAtomValue } from 'jotai';
import { AlertTriangleIcon } from 'lucide-react';
import { errorMessageAtom } from '../../atom/widget-atom';
import { WidgetHeader } from '../components/widget-header';

export const WidgetErrorScreen = () => {
        const errorMessage = useAtomValue(errorMessageAtom);

        return (
                <>
                        <WidgetHeader>
                                <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                                        <p className="font-semibold text-3xl">Hi there! </p>
                                        <p className="font-semibold text-lg">Let's get you started</p>
                                </div>
                        </WidgetHeader>
                        <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
                                <AlertTriangleIcon className="size-10 text-primary" />
                                <p>{errorMessage || 'Invalid configuration'}</p>
                        </div>
                </>
        );
};
