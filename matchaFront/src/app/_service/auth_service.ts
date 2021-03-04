import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { User } from "@matcha/shared";
import { Router } from "@angular/router";

const AUTH_API = "http://localhost:8080/api/";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private route: Router) {}

  login(user: Partial<User>): Observable<any> {
    //ok
    return this.http.post(
      AUTH_API + "authenticate",
      {
        userName: user.userName,
        password: user.password,
      },
      httpOptions
    );
  }

  logOut() {
    localStorage.clear();
    this.route.navigate(["/login"]);
  }

  register(user: Partial<User>): Observable<any> {
    //ok
    return this.http.post(
      AUTH_API + "register",
      {
        userName: user.userName,
        email: user.email,
        password: user.password,
        lastName: user.lastName,
        firstName: user.firstName,
      },
      httpOptions
    );
  }

  verify(user, id): Observable<any> {
    //ok
    return this.http.post(
      AUTH_API + "verify",
      {
        id: id,
        email: user.email,
      },
      httpOptions
    );
  }

  resendVerify(id: string): Observable<any> {
    return this.http.post(
      AUTH_API + "resend-verify",
      {
        id: id,
      },
      httpOptions
    );
  }

  forgotPass_s(user): Observable<any> {
    return this.http.post(
      AUTH_API + "forgotPass_s",
      {
        email: user.email,
      },
      httpOptions
    );
  }

  forgotPass_c(user, id): Observable<any> {
    //ok
    return this.http.post(
      AUTH_API + "forgotPass_c",
      {
        id: id,
        email: user.email,
        password: user.password,
      },
      httpOptions
    );
  }
}
