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
        vapiSecretAtom,
        widgetSettingsAtom,
} from '../../atom/widget-atom';
import { useAction, useMutation, useQuery } from 'convex/react';
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
        const setWidgetSettings = useSetAtom(widgetSettingsAtom);
        const setVapiSecret = useSetAtom(vapiSecretAtom);
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
                        setStep('settings');
                        return;
                }

                setLoadingMessage('Validating session...');

                validateContactSession({ contactSessionId })
                        .then((result) => {
                                setSessionValid(result.valid);
                                setStep('settings');
                        })
                        .catch(() => {
                                setSessionValid(false);
                                setStep('settings');
                        });
        }, [step, contactSessionId, validateContactSession, setLoadingMessage]);

        // Step 3: Get Widget Settings
        const widgetSettings = useQuery(
                api.public.widgetSettings.getByOrganizationId,
                organizationId ? { organizationId } : 'skip',
        );

        useEffect(() => {
                if (step !== 'settings') return;
                setLoadingMessage('Loading widget settings...');

                if (widgetSettings !== undefined) {
                        setWidgetSettings(widgetSettings);
                        setStep('vapi');
                }
        }, [step, widgetSettings, setStep, setWidgetSettings, setLoadingMessage]);

        // Step 4: Get Vapi Secret
        const getVapiSecrets = useAction(api.public.secrets.getVapiSecret);
        useEffect(() => {
                if (step !== 'vapi') return;

                if (!organizationId) {
                        setScreen('error');
                        setErrorMessage('Organization ID is required');
                        return;
                }

                setLoadingMessage('Loading Vapi feature...');

                getVapiSecrets({ organizationId })
                        .then((secret) => {
                                setVapiSecret(secret);
                                setStep('done');
                        })
                        .catch(() => {
                                setErrorMessage('Unable to load Vapi feature');
                                setVapiSecret(null);
                                setStep('done');
                        });
        }, [step, getVapiSecrets, setVapiSecret, setLoadingMessage]);

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
