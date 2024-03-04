import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  addDataToRedis(sessionId: string, database: string, answerServerSystem: string) {
    const url = 'https://mlmodels.idoldemos.net:5000/redis/add';  // Adjust the URL as necessary
    const data = {
      sessionid: sessionId,
      database: database,
      answerserversystem: answerServerSystem
    };

    this.http.post(url, data).subscribe({
      next: (response) => console.log("Data successfully added to Redis:", response),
      error: (error) => console.log("Failed to add data to Redis:", error)
    });
  }
}
