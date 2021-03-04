import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

import { AuthService } from "./auth_service";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private http: HttpClient
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
          console.log("iciciicicci");
          if (data.status) {
            console.log(route, state);
            //this.router.navigate(["home/discover"]);
            return true;
          } else {
            console.log("not valid token");
            this.authenticationService.logOut();
            return false;
          }
        },
        err => {
          console.log(err);
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
