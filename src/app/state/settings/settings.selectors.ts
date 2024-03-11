import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSettings from './settings.reducer';

export const selectSettingsState = createFeatureSelector<fromSettings.State>(
  fromSettings.settingsFeatureKey
);

export const selectShowVectorSearchResults = createSelector(
  selectSettingsState,
  state => state.showVectorSearchResults
);

export const selectShowIdolSearchResults = createSelector(
  selectSettingsState,
  state => state.showIdolSearchResults
);
