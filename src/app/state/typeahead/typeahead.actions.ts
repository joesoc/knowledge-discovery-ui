import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const TypeaheadActions = createActionGroup({
  source: 'Typeahead',
  events: {
    'Load Typeahead': props<{ search: string }>(),
    'Load Typeahead Success': props<{ results: string[] }>(),
    'Load Typeahead Failure': props<{ error: unknown }>(),
    'Focus Next Suggestion': emptyProps(),
    'Focus Previous Suggestion': emptyProps(),
    'Close Typeahead': emptyProps(),
  }
});
