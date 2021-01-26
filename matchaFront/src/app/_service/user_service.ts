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
export class userService {

  user: User

  constructor(private http: HttpClient) { }

  setUserNull() {
    return this.user = {
      userName: '',
      firstName: '',
      lastName: '',
      birthate: null,
      password: '',
      email: '',
      id: '',
      gender: '',
      showMe: '',
      bio: '',
      score: '',
      city: '',
      latitude: '',
      longitude: '',
      emailVerify: true,
      profileComplete: true,
      link: '',
      pictures: [
        {id: "picture1", url: '' as string},
        {id: "picture2", url: '' as string},
        {id: "picture3", url: '' as string},
        {id: "picture4", url: '' as string},
        {id: "picture5", url: '' as string},
        {id: "picture6", url: '' as string},
      ]
    };
  };

  getUser(id) {
    return new Promise(resolve => {
      this.getUserhttp(id).subscribe(
        data => {
          console.log(data);
          if (data.status === true) {
            resolve(data.user);
          } else {
            resolve(null)
          }
        },
        err => {
        }
      );
    });
  }

  getUserhttp(id): Observable<any> {
    return this.http.post(AUTH_API + 'getUser', {
      id: id
    }, httpOptions);
  }
}
