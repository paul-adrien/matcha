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
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user: Partial<User>): Observable<any> {
    return this.http.post(AUTH_API + 'authenticate', {
      username: user.userName,
      mdp: user.password
    }, httpOptions);
  }

  register(user: Partial<User>): Observable<any> {
    return this.http.post(AUTH_API + 'register', {
      username: user.userName,
      email: user.email,
      mdp: user.password,
      name: user.lastName,
      prenom: user.firstName
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
