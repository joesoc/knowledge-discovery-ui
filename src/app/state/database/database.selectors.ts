import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromDatabase from './database.reducer';

export const selectDatabaseState = createFeatureSelector<fromDatabase.State>(
  fromDatabase.databaseFeatureKey
);

export const selectDatabases = createSelector(selectDatabaseState, state => state.databases);

export const selectDatabaseCount = createSelector(
  selectDatabaseState,
  state => state.databases.length
);
