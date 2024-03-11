import { createActionGroup, emptyProps } from '@ngrx/store';

export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Toggle Vector Search Results': emptyProps(),
    'Toggle Idol Search Results': emptyProps(),
  },
});
