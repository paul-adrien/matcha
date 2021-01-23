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
export class profilService {

  constructor(private http: HttpClient) { }

  update(user: Partial<User>, saveEmail): Observable<any> {
    return this.http.post(AUTH_API + 'updateProfil', {
      userName: user.userName,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      bio: user.bio,
      gender: user.gender,
      saveEmail: saveEmail
    }, httpOptions);
  }

  takeViewProfil(id): Observable<any> {
    return this.http.post(AUTH_API + 'takeViewProfil', {
      user_id: id
    }, httpOptions);
  }
}
