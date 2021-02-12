import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "@matcha/shared";

const AUTH_API = "http://localhost:8080/api/";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class messagingService {
  constructor(private http: HttpClient) {}

  possiblyConv(id: string): Observable<any> {
    return this.http.post(
      AUTH_API + "possiblyConv",
      {
        id: id,
      },
      httpOptions
    );
  }

  activeConv(id: string): Observable<any> {
    return this.http.post(
      AUTH_API + "activeConv",
      {
        id: id,
      },
      httpOptions
    );
  }

  getMessage(id: string): Observable<any> {
    return this.http.post(
      AUTH_API + "getMessage",
      {
        conv_id: id,
      },
      httpOptions
    );
  }

  sendMessage(id: string, msg: string, sender_id: string): Observable<any> {
    return this.http.post(
      AUTH_API + "sendMessage",
      {
        conv_id: id,
        msg: msg,
        sender_id: sender_id
      },
      httpOptions
    );
  }
}
