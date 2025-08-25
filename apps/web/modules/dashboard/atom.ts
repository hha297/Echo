import { atomWithStorage } from 'jotai/utils';
import { STATUS_FILTER_KEY } from './constants';
import { Doc } from '@workspace/backend/_generated/dataModel';

export const statusFilterAtom = atomWithStorage<Doc<'conversation'>['status'] | 'all'>(STATUS_FILTER_KEY, 'all');
