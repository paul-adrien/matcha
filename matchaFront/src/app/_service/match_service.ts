import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@matcha/shared';

const AUTH_API = 'http://localhost:8080/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class matchService {

  constructor(private http: HttpClient) { }


  getSuggestion(id, minAge, maxAge, minScore, minLoc, sortBy): Observable<any> {
    return this.http.post(AUTH_API + 'getSuggestion', {
      id: id,
      minAge: minAge,
      maxAge: maxAge,
      minScore: minScore,
      minLoc: minLoc,
      sortBy: sortBy
    }, httpOptions);
  }
}
