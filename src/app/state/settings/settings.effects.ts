import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { EMPTY, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { SettingsActions } from './settings.actions';

@Injectable()
export class SettingsEffects {
  loadSettingss$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SettingsActions.loadSettingss),
      /** An EMPTY observable only emits completion. Replace with your own observable API request */
      concatMap(() => EMPTY as Observable<{ type: string }>)
    );
  });

  constructor(private actions$: Actions) {}
}
