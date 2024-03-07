import { createFeature, createReducer, on } from '@ngrx/store';
import { SettingsActions } from './settings.actions';

export const settingsFeatureKey = 'settings';

export interface State {
  vectorSearchResultsPosition: 'left' | 'right';
  idolSearchResultsPosition: 'left' | 'right';
}

export const initialState: State = {
  vectorSearchResultsPosition: 'right',
  idolSearchResultsPosition: 'left',
};

export const reducer = createReducer(
  initialState,
  on(SettingsActions.positionVectorSearchResults, (state, action) => ({
    ...state,
    vectorSearchResultsPosition: action.position,
  })),
  on(SettingsActions.positionIdolSearchResults, (state, action) => ({
    ...state,
    idolSearchResultsPosition: action.position,
  }))
);

export const settingsFeature = createFeature({
  name: settingsFeatureKey,
  reducer,
});
