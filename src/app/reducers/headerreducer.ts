// reducer.ts
import { Action, createReducer, on } from '@ngrx/store';
import { addSelectedDatabases } from '../actions/headeractions';
import { createSelector } from '@ngrx/store';

export const initialState: string[] = [];

const _selectedDatabaseReducer = createReducer(
  initialState,
  on(addSelectedDatabases, (state, { databases }) => [...databases])
);

export function selectedDatabaseReducer(state: string[] | undefined, action: Action) {
  return _selectedDatabaseReducer(state, action);
}

// The state argument refers to the global state tree, so you might need to drill down to your feature state
export const getSelectedDatabases = createSelector(
    (state: any) => state.selectedDatabases,  // Replace 'any' with your actual state type
    (selectedDatabases: string[]) => selectedDatabases
  );