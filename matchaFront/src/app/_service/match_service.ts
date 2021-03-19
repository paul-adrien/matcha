import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "@matcha/shared";
import { Filtre, mapUserBackToUserFront } from "../../../libs/user";
import { map } from "rxjs/operators";

const AUTH_API = "http://localhost:8080/api/";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class matchService {
  constructor(private http: HttpClient) {}

  getSuggestion(id: string): Observable<User[]> {
    //ok
    return this.http.get(AUTH_API + `users/${id}/getSuggestion`, httpOptions).pipe(
      map(res => {
        return Array.isArray(res) && res.map(user => mapUserBackToUserFront(user));
      })
    );
  }

  filtreUsersBy(id: string, filtre: Partial<Filtre>, suggestion: boolean): Observable<User[]> {
    let params = new HttpParams().set("suggestion", suggestion ? "true" : "false");
    return this.http
      .get(
        AUTH_API +
          `users/${id}/min-age/${filtre.age[0]}/max-age/${filtre.age[1]}/score/${filtre.score}/tags/${filtre.tags}/distance/${filtre.local}/sort-by/${filtre.sortBy}`,
        { ...httpOptions, params }
      )
      .pipe(map(res => Array.isArray(res) && res.map(user => mapUserBackToUserFront(user))));
  }
}
