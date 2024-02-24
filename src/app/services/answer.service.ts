import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAnswerServerAskResponse} from '../interfaces/IAnswerServerResponse';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IManageResourcesResponse } from '../interfaces/IAnswerServerConversationResponse';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private _url:string = "";
  private scheme:string = "https";
  constructor(private _http: HttpClient) { 

  }
  startConversation(): Observable<IManageResourcesResponse> {
    const operation = {
      "operation": "add",
      "type": "conversation_session"
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Include other headers as required by your server
    });

    this._url = `${this.scheme}://${environment.answerserver_fqdn}:${environment.answerserver_port}/action=ManageResources&SystemName=Conversation&Data=${btoa(JSON.stringify(operation))}&ResponseFormat=simplejson`;
    return this._http.get<IManageResourcesResponse>(this._url, { headers });
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
