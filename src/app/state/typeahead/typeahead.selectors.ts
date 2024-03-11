import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTypeahead from './typeahead.reducer';

export const selectTypeaheadState = createFeatureSelector<fromTypeahead.State>(
  fromTypeahead.typeaheadFeatureKey
);

export const selectTypeaheadResults = createSelector(selectTypeaheadState, state => state.results);

export const selectTypeaheadLoading = createSelector(selectTypeaheadState, state => state.loading);

export const selectTypeaheadIsOpen = createSelector(selectTypeaheadState, state => state.isOpen);

export const selectTypeaheadShowResults = createSelector(
  selectTypeaheadIsOpen,
  selectTypeaheadResults,
  (isOpen, results) => isOpen && results.length > 0
);
