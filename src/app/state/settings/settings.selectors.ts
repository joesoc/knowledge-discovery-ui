import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSettings from './settings.reducer';

export const selectSettingsState = createFeatureSelector<fromSettings.State>(
  fromSettings.settingsFeatureKey
);

export const selectVectorSearchResultsPosition = createSelector(
  selectSettingsState,
  state => state.vectorSearchResultsPosition
);

export const selectIdolSearchResultsPosition = createSelector(
  selectSettingsState,
  state => state.idolSearchResultsPosition
);
