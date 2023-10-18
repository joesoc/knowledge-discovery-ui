import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
// qms.service.ts
import { IQMSModelEncodeResponse } from '../interfaces/Iqmsmodel';

@Injectable({
  providedIn: 'root'
})
export class QmsService {

  constructor(@Inject(HttpClient) private http:HttpClient) { }

  encodeQMS(query:string): Observable<IQMSModelEncodeResponse>{
    return this.http.get<IQMSModelEncodeResponse>(`https://${environment.qms_fqdn}:${environment.qms_port}/action=modelencode&model=SentenceTransformer&text=${query}&ResponseFormat=simplejson`);

  }
}
