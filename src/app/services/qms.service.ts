import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IQMSModelEncodeResponse } from '../interfaces/Iqmsmodel';
import { IContentResponse } from '../interfaces/IcontentResponse';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QmsService {

  constructor(@Inject(HttpClient) private http:HttpClient) { }

  encodeQMS(query: string): Observable<IQMSModelEncodeResponse> {
    let params = new HttpParams()
      .set('action', 'modelencode')
      .set('model', 'SentenceTransformer')
      .set('text', query)
      .set('ResponseFormat', 'simplejson');
    const url = `https://${environment.qms_fqdn}:${environment.qms_port}/`;
    return this.http.get<IQMSModelEncodeResponse>(url, { params }).pipe(
      catchError(error => {
        console.error('Error fetching data', error);
        return throwError('Error fetching data');
      })
    );;
  }
  returnResponse(url:string, params:HttpParams): Observable<IContentResponse> {
    return this.http.get<IContentResponse>(url, { params }).pipe(
      catchError(error => {
        console.error('Error fetching data', error);
        return throwError('Error fetching data');
      })
    );
  }
  getVectorResults(vector:string, databases:string): Observable<IContentResponse> {
    let params = new HttpParams()
      .set('action', 'query')
      .set('text', 'VECTOR{' + vector + '}:VECTOR')
      .set('outputencoding', 'UTF8')
      .set('xmlmeta', 'true')
      .set('databasematch', databases)
      .set('sort', 'relevance')
      .set('anylanguage', 'true')
      .set('print', 'fields')
      .set('printfields', 'DREREFERENCE,WIKIPEDIA_CATEGORY,WIKIPEDIA_TOPIC,DRETITLE')
      .set('maxresults', '10')
      .set('totalresults', 'true')
      .set('summary', 'Context')
      .set('characters', '250')
      .set('highlight', 'SummaryTerms')
      .set('StartTag', '<span style="color: black; font-weight:bold;">')
      .set('ResponseFormat', 'simplejson');
      const url = `https://${environment.qms_fqdn}:${environment.qms_port}/`;
      return this.returnResponse(url, params);
  }
  getResults(query:string, databases:string): Observable<IContentResponse> {
    let params = new HttpParams()
      .set('action', 'query')
      .set('text', query)
      .set('outputencoding', 'UTF8')
      .set('xmlmeta', 'true')
      .set('databasematch', databases)
      .set('sort', 'relevance')
      .set('anylanguage', 'true')
      .set('print', 'fields')
      .set('printfields', 'DREREFERENCE,WIKIPEDIA_CATEGORY,WIKIPEDIA_TOPIC,DRETITLE')
      .set('maxresults', '10')
      .set('totalresults', 'true')
      .set('summary', 'Context')
      .set('characters', '250')
      .set('highlight', 'SummaryTerms')
      .set('StartTag', '<span style="color: black; font-weight:bold;">')
      .set('ResponseFormat', 'simplejson');
    const url = `https://${environment.qms_fqdn}:${environment.qms_port}/`;
    return this.returnResponse(url, params);
  }
}
