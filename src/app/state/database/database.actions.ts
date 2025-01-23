import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const DatabaseActions = createActionGroup({
  source: 'Database',
  events: {
    'Select Databases': props<{ databases: string[] }>(),
    'Reset Databases': emptyProps(),
  },
});
