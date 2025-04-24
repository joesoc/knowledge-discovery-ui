import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { DahResponse, Database, StoreStateResponse } from '../interfaces/IDahResponse';
import { LanguageIdentification } from '../interfaces/ILanguageIdentification';

@Injectable({
  providedIn: 'root',
})
export class DahService {
  private dahUrl = `${environment.dah_api}`;

  constructor(private http: HttpClient) {}

  getLanguage(text: string): Observable<LanguageIdentification> {
    let params = new HttpParams()
      .set('action', 'DetectLanguage')
      .set('text', text)
      .set('responseformat', 'simplejson');

    return this.http
      .get<LanguageIdentification>(this.dahUrl, { params })
      .pipe(map(response => response));
  }

  getDatabases(): Observable<Database[]> {
    let params = new HttpParams().set('action', 'GetStatus').set('responseformat', 'simplejson');
    return this.http.get<DahResponse>(this.dahUrl, { params }).pipe(
      map(response => response.autnresponse.responsedata.databases.database) // Adjusted to the correct path
    );
  }

  saveSearch(query: string): Observable<StoreStateResponse['autnresponse']['responsedata']> {
    let token = localStorage.getItem('token');
    const params = new HttpParams()
      .set('action', 'Query')
      .set('totalresults', 'true')
      .set('anylanguage', 'true')
      .set('SecurityInfo', token || '')
      .set('text', query)
      .set('storestate', 'true')
      .set('StoredStateTokenLifetime','-1')
      .set('print', 'NoReults')
      .set('responseformat', 'simplejson');

    return this.http.get<StoreStateResponse>(this.dahUrl, { params }).pipe(
      map(response => response.autnresponse.responsedata)
    );
  }
}
