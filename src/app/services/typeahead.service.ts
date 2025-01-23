import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { IQMSTypeAhead } from '../interfaces/IqmsTypeAhead';
import type { QuerySystem } from '../shared/header/settings-dialog/settings-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class TypeaheadService {
  private readonly http = inject(HttpClient);

  search(term: string) {
    const system = (localStorage.getItem('selectedQuerySystem') as QuerySystem) ?? 'Dictionary';

    return this.http.get<IQMSTypeAhead>(
      `${environment.qms_api}/?action=typeahead&behaviour=Phrase&text=${term}&Mode=${system}&ResponseFormat=simplejson`
    );
  }
}
