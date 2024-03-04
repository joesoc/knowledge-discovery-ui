import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DahResponse, Database } from '../interfaces/IDahResponse';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DahService {
  private dahUrl = `${environment.dah_api}/action=getstatus&responseformat=simplejson`;
  
  constructor(private http:HttpClient) { }

  getDatabases(): Observable<Database[]> {
    return this.http.get<DahResponse>(this.dahUrl)
      .pipe(
        map(response => response.autnresponse.responsedata.databases.database) // Adjusted to the correct path
      );
  }
  
}
