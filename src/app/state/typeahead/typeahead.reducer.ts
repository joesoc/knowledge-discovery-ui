import { createFeature, createReducer, on } from '@ngrx/store';
import { TypeaheadActions } from './typeahead.actions';

export const typeaheadFeatureKey = 'typeahead';

export interface State {
  loading: boolean;
  results: string[];
  isOpen: boolean;
}

export const initialState: State = {
  loading: false,
  results: [],
  isOpen: false,
};

export const reducer = createReducer(
  initialState,
  on(TypeaheadActions.loadTypeahead, state => ({
    ...state,
    loading: true,
  })),
  on(TypeaheadActions.loadTypeaheadSuccess, (state, action) => ({
    ...state,
    loading: false,
    results: action.results,
  })),
  on(TypeaheadActions.loadTypeaheadFailure, state => ({
    ...state,
    loading: false,
  })),
  on(TypeaheadActions.openTypeahead, state => ({ ...state, isOpen: true })),
  on(TypeaheadActions.closeTypeahead, state => ({ ...state, isOpen: false, loading: false, results: [] }))
);

export const typeaheadFeature = createFeature({
  name: typeaheadFeatureKey,
  reducer,
});
