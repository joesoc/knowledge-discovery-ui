import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  addDataToRedis(
    sessionId: string,
    database: string,
    answerServerSystem: string,
    securityinfo: string,
    selectedSavedSearchStateID: string = ''
  ) {
    const url = `${environment.mlmodels_api}/redis/add`; // Adjust the URL as necessary
    const data = {
      sessionid: sessionId,
      database: database,
      answerserversystem: answerServerSystem,
      securityinfo: securityinfo,
      storedstateid: selectedSavedSearchStateID
    };

    this.http.post(url, data).subscribe({
      next: response => console.log('Data successfully added to Redis:', response),
      error: error => console.log('Failed to add data to Redis:', error),
    });
  }
}
