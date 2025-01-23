import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { IAnswerBankResponse } from '../interfaces/IAnswerBankResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnswerBankService {

  readonly answerbank_url: string = `${environment.answerbank_api}`;
  constructor(private _http:HttpClient) { }

  getrelatedquestions(question:string): Observable<IAnswerBankResponse> {
    const params = new HttpParams()
    .set('action','Query')
    .set('text',question)
    .set('maxresults','5')
    .set('print','all')
    .set('ResponseFormat','simplejson');

    return this._http.get<IAnswerBankResponse>(this.answerbank_url,{params});
  }
}
