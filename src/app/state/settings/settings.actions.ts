import { createActionGroup, props } from '@ngrx/store';

export type SearchResultsPosition = 'left' | 'right';

export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Position Vector Search Results': props<{ position: SearchResultsPosition }>(),
    'Position Idol Search Results': props<{ position: SearchResultsPosition }>(),
  },
});
