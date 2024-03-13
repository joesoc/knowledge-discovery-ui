import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ICommunityUserReadResponse } from "../interfaces/ICommunityUserReadResponse";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.prod";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    
    get isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    get token(): string | null {
        return localStorage.getItem('token');
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http.get<ICommunityUserReadResponse>(`${environment.community_api}/action=UserRead&SecurityInfo=true&username=${username}&password=${encodeURIComponent(password)}&responseFormat=simplejson`)
            .pipe(
                tap((response: ICommunityUserReadResponse) => {
                    // todo replace with actual value
                    localStorage.setItem('username', username);
                    localStorage.setItem('token', response.autnresponse.responsedata.securityinfo);
                }),
                map((response: ICommunityUserReadResponse) => {
                    return response.autnresponse.responsedata.authenticate === 'true';
                })
            );
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
