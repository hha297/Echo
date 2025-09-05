import { atom } from 'jotai';
import { WidgetScreen } from '../types';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import { CONTACT_SESSION_KEY } from '../constants';
import { Doc, Id } from '@workspace/backend/_generated/dataModel';

// Basic widget state atoms
export const screenAtom = atom<WidgetScreen>('loading');
export const organizationIdAtom = atom<string | null>(null);

// Organization-scoped contact session atom
export const contactSessionIdAtomFamily = atomFamily((organizationId: string) => {
        return atomWithStorage<Id<'contactSession'> | null>(`${CONTACT_SESSION_KEY}_${organizationId}`, null);
});

export const errorMessageAtom = atom<string | null>(null);
export const loadingMessageAtom = atom<string | null>(null);
export const conversationIdAtom = atom<Id<'conversation'> | null>(null);
export const widgetSettingsAtom = atom<Doc<'widgetSettings'> | null>(null);
export const vapiSecretAtom = atom<{ publicApiKey: string } | null>(null);
export const hasVapiSecretAtom = atom((get) => get(vapiSecretAtom) !== null);
