import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAnswerServerAskResponse} from '../interfaces/IAnswerServerResponse';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private _url:string = "";
  private scheme:string = "https";
  constructor(private _http:HttpClient) { 
    this._url = `${this.scheme}://${environment.answerserver_fqdn}:${environment.answerserver_port}/`;

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
