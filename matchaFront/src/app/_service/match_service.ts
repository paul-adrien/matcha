import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "@matcha/shared";
import { Filtre } from "../../../libs/user";

const AUTH_API = "http://localhost:8080/api/";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class matchService {
  constructor(private http: HttpClient) {}

  getSuggestion(id: string): Observable<any> {
    return this.http.post(
      AUTH_API + "getSuggestion",
      {
        id: id,
      },
      httpOptions
    );
  }

  sortUsersBy(users, sort, id): Observable<any> {
    return this.http.post(
      AUTH_API + "sortUsersBy",
      {
        sort: sort,
        users: users,
        id: id,
      },
      httpOptions
    );
  }

  filtreUsersBy(id, users, filtre: Partial<Filtre>): Observable<any> {
    return this.http.post(
      AUTH_API + "filtreUsersBy",
      {
        id: id,
        users: users,
        minAge: filtre.minAge,
        maxAge: filtre.maxAge,
        minScore: filtre.score,
        maxLoc: filtre.local,
        minTag: filtre.tags,
      },
      httpOptions
    );
  }
}
