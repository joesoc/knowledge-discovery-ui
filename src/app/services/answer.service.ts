import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAnswerServerAskResponse} from '../interfaces/IAnswerServerResponse';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IManageResourcesResponse } from '../interfaces/IAnswerServerConversationResponse';
import { IAnswerServerConversationPrompts } from '../interfaces/IAnswerServerConversationPrompts';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private _url:string = "";
  private scheme:string = "https";
  constructor(private _http: HttpClient) { 

  }
  getSessionID(): Observable<IManageResourcesResponse> {
    const operation = {
      "operation": "add",
      "type": "conversation_session"
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Include other headers as required by your server
    });
  
    const baseUrl = `${environment.api}`;
    const queryParams = `action=ManageResources&SystemName=Conversation&Data=${btoa(JSON.stringify(operation))}&ResponseFormat=simplejson`;
  
    this._url = `${baseUrl}/${queryParams}`;
    return this._http.get<IManageResourcesResponse>(this._url, { headers });
  }
  
  converse(sessionID:string, text:string): Observable<IAnswerServerConversationPrompts> {
    let params = new HttpParams()
      .set('action', 'converse')
      .set('SessionId', sessionID)
      .set('SystemName','Conversation')
      .set('text', text)
      .set('ResponseFormat', 'simplejson');
      const baseUrl = `${environment.api}`;
    return this._http.get<IAnswerServerConversationPrompts>(baseUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching data', error);
        return throwError('Error fetching data');
      })
    );
  }
  ask(question:string){
    let params = new HttpParams()
      .set('action', 'ask')
      .set('text', question)
      .set('ResponseFormat', 'simplejson');
    return this._http.get<IAnswerServerAskResponse>(this._url, { params }).pipe(
      catchError(error => {
        console.error('Error fetching data', error);
        return throwError('Error fetching data');
      })
    );;
  }
}
