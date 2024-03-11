import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
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

    login(username: string, password: string): void {
        this.http.get<ICommunityUserReadResponse>(`${environment.community_api}/action=UserRead&SecurityInfo=true&username=${username}&password=${password}&responseFormat=simplejson`)
            .subscribe((response: ICommunityUserReadResponse) => {
                // todo replace with actual value
                localStorage.setItem('username', username);
                localStorage.setItem('token', response.autnresponse.responsedata.securityinfo);
                this.router.navigate(['/search']);
            });
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
