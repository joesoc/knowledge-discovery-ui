import { createFeature, createReducer, on } from '@ngrx/store';
import { DatabaseActions } from './database.actions';

export const databaseFeatureKey = 'database';

export interface State {
  databases: string[];
}

export const initialState: State = {
  databases: [],
};

export const reducer = createReducer(
  initialState,
  on(DatabaseActions.selectDatabases, (state, action) => ({
    ...state,
    databases: action.databases,
  })),
  on(DatabaseActions.resetDatabases, (state) => ({
    ...state,
    databases: [],
  }))
);

export const databaseFeature = createFeature({
  name: databaseFeatureKey,
  reducer,
});
