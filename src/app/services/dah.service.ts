import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DahResponse, Database } from '../interfaces/IDahResponse';
import { environment } from 'src/environments/environment.prod';
import { LanguageIdentification } from '../interfaces/ILanguageIdentification';


@Injectable({
  providedIn: 'root'
})
export class DahService {
  private dahUrl = `${environment.dah_api}`;
  
  constructor(private http:HttpClient) { }

  getLanguage(text: string): Observable<LanguageIdentification> {
    let params = new HttpParams()
    .set('action', 'DetectLanguage')
    .set('text', text)
    .set('responseformat', 'simplejson');

    return this.http.get<LanguageIdentification>(this.dahUrl, {params}).pipe(map(response => response));
  }

  getDatabases(): Observable<Database[]> {
    let params = new HttpParams()
      .set('action', 'GetStatus')
      .set('responseformat', 'simplejson');
    return this.http.get<DahResponse>(this.dahUrl, {params})
      .pipe(
        map(response => response.autnresponse.responsedata.databases.database) // Adjusted to the correct path
      );
  }
  
}
