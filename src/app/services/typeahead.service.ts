import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "src/environments/environment.prod";
import { IQMSTypeAhead } from "../interfaces/IqmsTypeAhead";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TypeaheadService {
    private readonly http = inject(HttpClient);

    search(term: string) {
        return this.http.get<IQMSTypeAhead>(`${environment.qms_api}/?action=typeahead&behaviour=Trailing&text=${term}&Mode=Index&ResponseFormat=simplejson`);
    }
}