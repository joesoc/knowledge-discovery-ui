// actions.ts
import { createAction, props } from '@ngrx/store';

export const addSelectedDatabases = createAction(
  '[Database] Add Selected',
  props<{ databases: string[] }>()
);
