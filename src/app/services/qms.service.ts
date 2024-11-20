import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment.prod';
import { IQMSModelEncodeResponse } from '../interfaces/Iqmsmodel';
import { IContentResponse } from '../interfaces/IcontentResponse';
import { catchError, throwError } from 'rxjs';
import { IQMSPromotionResult } from '../interfaces/IQMSPromotionResult';
import { DefaultOperator } from '../shared/header/settings-dialog/settings-dialog.component';

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
    const url = `${environment.qms_api}/`;
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
  returnQMSResponse(url:string, params:HttpParams): Observable<IQMSPromotionResult> {
    return this.http.get<IQMSPromotionResult>(url, { params }).pipe(
      catchError(error => {
        console.error('Error fetching data', error);
        return throwError('Error fetching data');
      }
    ));
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
      .set('printfields','DRETITLE')
      .set('maxresults', '10')
      .set('totalresults', 'true')
      .set('Combine','Simple')
      .set('summary', 'Concept')
      .set('characters', '250')
      .set('highlight', 'terms')
      .set('ExpandQuery','True')
      .set('vectormetadata','true')
      .set('StartTag', '<span style="color: black; font-weight:bold;">')
      .set('EndTag', '</span">')
      .set('ActionID', 'webui.idoldemos.net')
      .set('ResponseFormat', 'simplejson');
      const url = `${environment.qms_api}/`;
      return this.returnResponse(url, params);
  }
  getResults(query:string, databases:string): Observable<IContentResponse> {
    const defaultoperator = localStorage.getItem('selectedOperator') as DefaultOperator ?? 'DNEAR';
    const queryLanguage = localStorage.getItem('QueryLanguage') ?? "[]";
    console.log('Query Language: ', queryLanguage);
    let params = new HttpParams()
      .set('action', 'query')
      .set('text', query)
      .set('outputencoding', 'UTF8')
      .set('xmlmeta', 'true')
      .set('databasematch', databases)
      .set('sort', 'relevance')
      .set('anylanguage', 'true')
      .set('print', 'fields')
      .set('printfields','DRETITLE')
      .set('maxresults', '10')
      .set('Combine','Simple')
      .set('totalresults', 'true')
      .set('summary', 'Context')
      .set('characters', '250')
      .set('DefaultOperator', defaultoperator)
      .set('highlight', 'SummaryTerms')
      .set('LanguageType', queryLanguage)
      .set('ExpandQuery','True')
      .set('ActionID', 'webui.idoldemos.net')
      .set('StartTag', '<span style="color: black; font-weight:bold;">')
      .set('ResponseFormat', 'simplejson');
    const url = `${environment.qms_api}/`;
    return this.returnResponse(url, params);
  }

  getQMSPromotions(query:string, selectedDatabase: string): Observable<IQMSPromotionResult> {
    let params = new HttpParams()
      .set('action', 'Query')	
      .set('text', '('+query+')')
      .set('Combine', 'Simple')
      .set('MaxResults','1')
      .set('Summary', 'Context')
      .set('databasematch', selectedDatabase)	
      .set('Promotions', 'true')	
      .set('ResponseFormat', 'simplejson')
      .set('anylanguage', 'true')
      .set('TotalResults', 'true')
      .set('Start','1')
      .set('XMLMeta', 'true')
      .set('Sort','Relevance')
      .set('Predict', 'true') 
      .set('MinScore', '0')
      .set('Hightlight', 'SummaryTerms')
      .set('Characters', '250')
      .set('print', 'Fields')
      .set('printfields','DRETITLE,DRECONTENT')
      .set('ActionID', 'promotionswebui.idoldemos.net')
      .set('ExpandQuery', 'true');	
      
      const url = `${environment.qms_api}/`;
      return this.returnQMSResponse(url, params);
  }
  getParagraphContext(query:string, selectedDatabase: string): Observable<IContentResponse> {
    let params = new HttpParams()
      .set('action', 'query')
      .set('text', query)
      .set('outputencoding', 'UTF8')
      .set('sort', 'relevance')
      .set('databasematch', selectedDatabase)
      .set('anylanguage', 'true')
      .set('maxresults', '1')
      .set('totalresults', 'true')
      .set('summary', 'Context')
      .set('Sentences','3')
      .set('characters', '250')
      .set('ResponseFormat', 'simplejson');
    const url = `${environment.qms_api}/`;
    return this.returnResponse(url, params);
  }


}
