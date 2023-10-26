// actions.ts
import { createAction, props } from '@ngrx/store';

export const addSelectedDatabases = createAction(
  '[Database] Add Selected',
  props<{ databases: string[] }>()
);

export const showVectorResults = createAction(
  '[Vector] Show Results',
  props<{ show: boolean }>()
);

export const showIDOLResults = createAction(
  '[IDOL] Show Results',
  props<{ show: boolean }>()
);