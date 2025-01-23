import { createFeature, createReducer, on } from '@ngrx/store';
import { SettingsActions } from './settings.actions';

export const settingsFeatureKey = 'settings';

export interface State {
  showVectorSearchResults: boolean;
  showIdolSearchResults: boolean;
}

export const initialState: State = {
  showVectorSearchResults: false,
  showIdolSearchResults: true,
};

export const reducer = createReducer(
  initialState,
  on(SettingsActions.toggleVectorSearchResults, state => ({
    ...state,
    showVectorSearchResults: !state.showVectorSearchResults,
  })),
  on(SettingsActions.toggleIdolSearchResults, state => ({
    ...state,
    showIdolSearchResults: !state.showIdolSearchResults,
  }))
);

export const settingsFeature = createFeature({
  name: settingsFeatureKey,
  reducer,
});
