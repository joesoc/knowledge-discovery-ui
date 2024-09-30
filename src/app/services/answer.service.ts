import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IAnswerServerConversationPrompts } from '../interfaces/IAnswerServerConversationPrompts';
import { IManageResourcesResponse } from '../interfaces/IAnswerServerConversationResponse';
import {
  IAnswerServerGetStatusResponse,
  System,
} from '../interfaces/IAnswerServerGetStatusResponse';
import { IAnswerServerAskResponse } from '../interfaces/IAnswerServerResponse';
import { RAGResponse } from '../interfaces/IAnswerServerRAGResponse';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private _url: string = `${environment.answerserver_api}`;
  private scheme: string = 'https';
  constructor(
    private _http: HttpClient,
  ) {}
  getSessionID(): Observable<IManageResourcesResponse> {
    const operation = {
      operation: 'add',
      type: 'conversation_session',
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Include other headers as required by your server
    });

    const baseUrl = `${environment.answerserver_api}`;
    const queryParams = `action=ManageResources&SystemName=Conversation&Data=${btoa(JSON.stringify(operation))}&ResponseFormat=simplejson`;

    this._url = `${baseUrl}/${queryParams}`;
    return this._http.get<IManageResourcesResponse>(this._url, { headers });
  }

  converse(sessionID: string, text: string): Observable<IAnswerServerConversationPrompts> {
    let params = new HttpParams()
      .set('action', 'converse')
      .set('SessionId', sessionID)
      .set('SystemName', 'Conversation')
      .set('text', text)
      .set('ResponseFormat', 'simplejson');
    const baseUrl = `${environment.answerserver_api}`;
    return this._http.get<IAnswerServerConversationPrompts>(baseUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching data', error);
        return throwError('Error fetching data');
      })
    );
  }
  async ask(question: string, databaseMatch: string) {
    let answerSystem: string = localStorage.getItem('selectedSearchAnswerSystem') ?? 'AlbertVector';
    let params = new HttpParams()
      .set('action', 'ask')
      .set('text', question)
      .set('SystemNames', answerSystem)
      .set('DatabaseMatch', databaseMatch)
      .set('ResponseFormat', 'simplejson');
    const baseUrl = `${environment.answerserver_api}`;
    return this._http.get<IAnswerServerAskResponse | RAGResponse>(baseUrl, { params }).pipe(
      catchError(error => {
        console.error('Error fetching data', error);
        return throwError('Error fetching data');
      })
    );
  }

  getAnswerSystems(): Observable<System[]> {
    const baseUrl = `${environment.answerserver_api}`;
    let params = new HttpParams().set('action', 'getstatus').set('ResponseFormat', 'simplejson');
    return this._http
      .get<IAnswerServerGetStatusResponse>(`${baseUrl}`, { params })
      .pipe(
        map(
          (response: IAnswerServerGetStatusResponse) =>
            response.autnresponse.responsedata.systems.system
        )
      );
  }
}
