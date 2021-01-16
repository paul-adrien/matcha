import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user): Observable<any> {
    return this.http.post(AUTH_API + 'authenticate', {
      username: user.username,
      mdp: user.password
    }, httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(AUTH_API + 'register', {
      username: user.username,
      email: user.email,
      mdp: user.password,
      name: user.name,
      prenom: user.prenom
    }, httpOptions);
  }

  verify(user, id): Observable<any> {
    return this.http.post(AUTH_API + 'verify', {
      id: id,
      email: user.email
    }, httpOptions);
  }

  forgotPass_s(user): Observable<any> {
    return this.http.post(AUTH_API + 'forgotPass_s', {
      email: user.email
    }, httpOptions);
  }

  forgotPass_c(user, id): Observable<any> {
    return this.http.post(AUTH_API + 'forgotPass_c', {
      id: id,
      email: user.email,
      mdp: user.password
    }, httpOptions);
  }
}
