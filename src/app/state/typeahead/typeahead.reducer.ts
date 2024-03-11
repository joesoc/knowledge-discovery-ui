import { createFeature, createReducer, on } from '@ngrx/store';
import { TypeaheadActions } from './typeahead.actions';

export const typeaheadFeatureKey = 'typeahead';

export interface State {
  loading: boolean;
  results: string[];
  focusIndex: number | undefined;
  isOpen: boolean;
}

export const initialState: State = {
  loading: false,
  results: [],
  focusIndex: undefined,
  isOpen: false,
};

export const reducer = createReducer(
  initialState,
  on(TypeaheadActions.loadTypeahead, state => ({ loading: true, results: [], focusIndex: undefined, isOpen: true })),
  on(TypeaheadActions.loadTypeaheadSuccess, (state, action) => ({ ...state, loading: false, results: action.results, focusIndex: action.results.length > 0 ? 0 : undefined })),
  on(TypeaheadActions.loadTypeaheadFailure, (state, action) => state),
  on(TypeaheadActions.closeTypeahead, state => ({ ...state, isOpen: false })),
  on(TypeaheadActions.focusNextSuggestion, (state) => {
    // if the dropdown is not open, focusIndex should be undefined
    // if there are no results, focusIndex should be undefined
    if (state.results.length === 0 || !state.isOpen) {
      return ({ ...state, focusIndex: undefined });
    }

    // if focusIndex is undefined, set it to 0
    if (state.focusIndex === undefined) {
      return ({ ...state, focusIndex: 0 });
    }

    // if focusIndex is at the last index, set it to 0
    if (state.focusIndex === state.results.length - 1) {
      return ({ ...state, focusIndex: 0 });
    }

    // otherwise, increment it by 1
    return ({ ...state, focusIndex: state.focusIndex + 1 });
  }),
  on(TypeaheadActions.focusPreviousSuggestion, (state) => {
    // if there are no results, focusIndex should be undefined
    if (state.results.length === 0 || !state.isOpen) {
      return ({ ...state, focusIndex: undefined });
    }

    // if focusIndex is undefined, set it to the last index
    if (state.focusIndex === undefined) {
      return ({ ...state, focusIndex: state.results.length - 1 });
    }

    // if focusIndex is at the first index, set it to the last index
    if (state.focusIndex === 0) {
      return ({ ...state, focusIndex: state.results.length - 1 });
    }

    // otherwise, decrement it by 1
    return ({ ...state, focusIndex: state.focusIndex - 1 });
  }),
);

export const typeaheadFeature = createFeature({
  name: typeaheadFeatureKey,
  reducer,
});

