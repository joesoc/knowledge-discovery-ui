import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IdolFieldResult {
  FILTER_FIELD_NAME?: string;
  FILTER_FIELD_DISPLAY_NAME?: string;
}

export interface IdolResponse {
  autnresponse: {
    response: string;
    responsedata: {
      hit: {
        document: {
          FILTER_FIELD_NAME?: string[];
          FILTER_FIELD_DISPLAY_NAME?: string[];
        };
      }[];
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private baseUrl = 'api/configure';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves parametric filters (FILTER_FIELD_NAME and DISPLAY_NAME)
   * from IDOL Content Engine using a text query.
   * @param textQuery Query string, e.g. "*" or "PROFILE_NAME:engineering_jobs"
   */
  getParametricFilterFields(textQuery: string = '*'): Observable<IdolFieldResult[]> {
    const params = new HttpParams()
      .set('action', 'query')
      .set('text', textQuery)
      .set('fieldname', 'FILTER_FIELD_NAME,FILTER_FIELD_DISPLAY_NAME')
      .set('maxresults', '100')
      .set('outputencoding', 'utf8')
      .set('FieldText', 'MATCH{True}:IS_ACTIVE')
      .set('print', 'all');

    return new Observable(observer => {
      this.http.get<IdolResponse>(this.baseUrl, { params }).subscribe({
        next: (response) => {
          const docs = response?.autnresponse?.responsedata?.hit || [];
          const fields = docs.map(hit => ({
            FILTER_FIELD_NAME: hit.document.FILTER_FIELD_NAME?.[0],
            FILTER_FIELD_DISPLAY_NAME: hit.document.FILTER_FIELD_DISPLAY_NAME?.[0]
          }));
          observer.next(fields);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}
