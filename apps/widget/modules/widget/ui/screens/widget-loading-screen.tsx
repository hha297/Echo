'use client';

import { Loader2Icon } from 'lucide-react';

import { WidgetHeader } from '../components/widget-header';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {
        contactSessionIdAtomFamily,
        errorMessageAtom,
        loadingMessageAtom,
        organizationIdAtom,
        screenAtom,
} from '../../atom/widget-atom';
import { useAction, useMutation } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';

type InitStep = 'org' | 'session' | 'settings' | 'vapi' | 'done';
export const WidgetLoadingScreen = ({ organizationId }: { organizationId: string | null }) => {
        const [step, setStep] = useState<InitStep>('org');
        const [sessionValid, setSessionValid] = useState(false);

        const loadingMessage = useAtomValue(loadingMessageAtom);

        const setOrganizationId = useSetAtom(organizationIdAtom);
        const setLoadingMessage = useSetAtom(loadingMessageAtom);
        const setErrorMessage = useSetAtom(errorMessageAtom);
        const setScreen = useSetAtom(screenAtom);

        const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ''));

        // Step 1: Validate Organization
        const validateOrganization = useAction(api.public.organization.validate);
        useEffect(() => {
                if (step !== 'org') {
                        return;
                }

                setLoadingMessage('Loading organization ID');

                if (!organizationId) {
                        setErrorMessage('Organization ID is required');
                        setScreen('error');
                        return;
                }

                setLoadingMessage('Verifying organization...');

                validateOrganization({ organizationId })
                        .then((result) => {
                                if (result.valid) {
                                        setOrganizationId(organizationId);
                                        setStep('session');
                                } else {
                                        setErrorMessage(result.reason || 'Invalid configuration');
                                        setScreen('error');
                                }
                        })
                        .catch(() => {
                                setErrorMessage('Unable to verify organization');
                                setScreen('error');
                        });
        }, [
                step,
                organizationId,
                setErrorMessage,
                setScreen,
                setOrganizationId,
                setStep,
                validateOrganization,
                setLoadingMessage,
        ]);

        // Step 2: Validate Session
        const validateContactSession = useMutation(api.public.contactSession.validate);
        useEffect(() => {
                if (step !== 'session') return;

                setLoadingMessage('Finding contact session ID...');

                if (!contactSessionId) {
                        setSessionValid(false);
                        setStep('done');
                        return;
                }

                setLoadingMessage('Validating session...');

                validateContactSession({ contactSessionId })
                        .then((result) => {
                                setSessionValid(result.valid);
                                setStep('done');
                        })
                        .catch(() => {
                                setSessionValid(false);
                                setStep('done');
                        });
        }, [step, contactSessionId, validateContactSession, setLoadingMessage]);

        useEffect(() => {
                if (step !== 'done') return;

                const hasValidSession = contactSessionId && sessionValid;

                setScreen(hasValidSession ? 'selection' : 'auth');
        }, [step, contactSessionId, sessionValid, setScreen]);

        return (
                <>
                        <WidgetHeader>
                                <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                                        <p className="font-semibold text-3xl">Hi there! </p>
                                        <p className="font-semibold text-lg">Let's get you started</p>
                                </div>
                        </WidgetHeader>
                        <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
                                <Loader2Icon className="animate-spin size-10 text-primary" />
                                <p>{loadingMessage || 'Loading...'}</p>
                        </div>
                </>
        );
};
