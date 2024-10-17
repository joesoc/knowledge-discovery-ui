import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IHighlightingResult } from 'src/app/interfaces/IHighlightingResult';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class HighlightingService {

  constructor(private _http:HttpClient) { }

  getHighlightingResults(text:string, terms_to_highlight:string): Observable<IHighlightingResult> {
    let params = new HttpParams()
      .set('action', 'highlight')
      .set('Text', text)
      .set('Links', terms_to_highlight)
      .set('responseFormat', 'simplejson'); 
    const baseUrl = `${environment.dah_api}`;
    return this._http.get<IHighlightingResult>(baseUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching data', error);
        return throwError('Error fetching data');
      })
    );
  }
}
