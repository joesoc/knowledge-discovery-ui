import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'; // adjust if using a libs structure
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class NifiService {

  constructor(private http: HttpClient) { }
  postAudit(username:string, searchinput:string) {
    const url = `${environment.nifiAuditUrl}`; // Adjust the URL as necessary
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });    

    const data = {
      username: username,
      searchinput: searchinput,
      ref: uuidv4(),
      time: new Date().toISOString()
    };

    return this.http.post(url,data, { headers });
  }
}
