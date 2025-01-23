import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ProfileUserResponse } from '../interfaces/profile-user.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProfileUserService {
  private apiUrl = `${environment.community_api}`; // Replace with the actual API URL

  constructor(private http: HttpClient) {}

  // Parse the response using the imported interfaces
  private parseResponse(response: any): ProfileUserResponse {
    if (response?.autnresponse?.response === 'SUCCESS') {
      return {
        action: response.autnresponse.action,
        response: 'SUCCESS',
        responsedata: response.autnresponse.responsedata,
      } as ProfileUserResponse;
    } else if (response?.autnresponse?.response === 'ERROR') {
      return {
        action: response.autnresponse.action,
        response: 'ERROR',
        responsedata: response.autnresponse.responsedata,
      } as ProfileUserResponse;
    } else {
      throw new Error('Unknown response format');
    }
  }
  /**
   * Create or update a user profile.
   * @param userName - The name of the user.
   * @param documentRef - The Reference of the document to train the profile with.
   * @param optionalParams - Additional optional parameters for the API call.
   * @returns An Observable containing the API response.
   */
  profileUser(userName: string, documentRef: string): Observable<ProfileUserResponse> {
    let params = new HttpParams()
      .set('action', 'ProfileUser')
      .set('UserName', userName)
      .set('Document', documentRef)
      .set('ShowUpdates', 'true')
      .set('ResponseFormat', 'simplejson');

    // Configure headers for the request
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get(this.apiUrl, { headers, params })
      .pipe(map((response: any) => this.parseResponse(response)));
  }
}
