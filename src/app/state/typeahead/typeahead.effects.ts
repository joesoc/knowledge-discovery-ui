import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { TypeaheadActions } from './typeahead.actions';
import { TypeaheadService } from '../../services/typeahead.service';


@Injectable()
export class TypeaheadEffects {
  private readonly actions$ = inject(Actions);
  private readonly typeaheadService = inject(TypeaheadService);

  loadTypeahead$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TypeaheadActions.loadTypeahead),
      concatMap((action) =>
        this.typeaheadService.search(action.search).pipe(
          map(data => TypeaheadActions.loadTypeaheadSuccess({ results: data.autnresponse.responsedata.expansion.map((item) => {
            // the results come back capitalized, so we need to lowercase them only having the first letter capitalized
            return item.$.charAt(0).toUpperCase() + item.$.slice(1).toLowerCase();
          })})),
          catchError(error => of(TypeaheadActions.loadTypeaheadFailure({ error }))))
      )
    );
  });


}
