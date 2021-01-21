import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth_service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService,
        private http: HttpClient
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (this.verify(JSON.parse(localStorage.getItem('token')), JSON.parse(localStorage.getItem('id'))).subscribe(
        data => {
          console.log(data);
          return true;
        },
        err => {
          console.log(err);
          return false;
        }
      )) {
        return true;
      }
      return false;
    }

    verify(token, id): Observable<any> {
      return this.http.post('http://localhost:8080/api/' + 'verifyToken', {
        id: id,
        token: token
      }, httpOptions);
    }
}
