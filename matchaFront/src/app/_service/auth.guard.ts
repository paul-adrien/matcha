import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

import { AuthService } from "./auth_service";
import { userService } from './user_service';
import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private http: HttpClient,
    private userService: userService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let res: boolean;
    if (
      JSON.parse(localStorage.getItem("token")) === null ||
      JSON.parse(localStorage.getItem("id")) === null
    ) {
      this.authenticationService.logOut();
      return false;
    }
    return this.verify(
      JSON.parse(localStorage.getItem("token")),
      JSON.parse(localStorage.getItem("id"))
    )
      .toPromise()
      .then(
        data => {
          if (data.status) {
            //this.router.navigate(["home/discover"]);
            return true;
          } else {
            this.authenticationService.logOut();
            return false;
          }
        },
        err => {
          this.authenticationService.logOut();
          return false;
        }
      );
  }

  verify(token, id): Observable<any> {
    return this.http.post(
      "http://localhost:8080/api/" + "verifyToken",
      {
        id: id,
        token: token,
      },
      httpOptions
    );
  }
}
