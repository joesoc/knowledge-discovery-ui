import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { IAnswerBankResponse } from '../interfaces/IAnswerBankResponse';

@Injectable({
  providedIn: 'root',
})
export class AnswerBankService {
  readonly answerbank_url: string = `${environment.answerbank_api}`;
  constructor(private _http: HttpClient) {}
  
  // https://answerbankagentstore.idoldemos.net:12200/action=Query&text=*&databasematch=questionclasses&anylanguage=true&print=fields&printfields=DRETITLE,ANSWER,STATE,POPULARITY_COUNT&responseformat=simplejson

  getRelatedQuestions(question: string): Observable<IAnswerBankResponse> {
    const params = new HttpParams()
      .set('question', question)
    return this._http.get<IAnswerBankResponse>(this.answerbank_url, { params });
  }
}
