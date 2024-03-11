import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTypeahead from './typeahead.reducer';

export const selectTypeaheadState = createFeatureSelector<fromTypeahead.State>(
  fromTypeahead.typeaheadFeatureKey
);

export const selectTypeaheadResults = createSelector(
  selectTypeaheadState,
  (state) => state.results
);

export const selectTypeaheadLoading = createSelector(
  selectTypeaheadState,
  (state) => state.loading
);

export const selectTypeaheadShowResults = createSelector(
  selectTypeaheadState,
  (state) => state.isOpen && state.results.length > 0
);

export const selectTypeaheadFocusIndex = createSelector(
  selectTypeaheadState,
  (state) => state.focusIndex
);

export const selectFocusedTypeaheadResult = createSelector(
  selectTypeaheadState,
  (state) => state.focusIndex ? state.results[state.focusIndex] : null
);