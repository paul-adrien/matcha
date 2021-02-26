import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "@matcha/shared";
import { PossConv, ActiveConv, Messages } from '../../../libs/messaging';

const AUTH_API = "http://localhost:8080/api/";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class messagingService {
  constructor(private http: HttpClient) {}

  possiblyConv(id: string): Observable<PossConv[]> {
    return this.http.get<PossConv[]>(
      AUTH_API + `possiblyConv/${id}`,
      httpOptions
      );
  }

  activeConv(id: string): Observable<ActiveConv[]> {
    return this.http.get<ActiveConv[]>(
      AUTH_API + `activeConv/${id}`,
      httpOptions
      );
  }

  getMessage(id: string): Observable<Messages[]> {
    return this.http.get<Messages[]>(
      AUTH_API + `getMessage/${id}`,
      httpOptions
      );
  }

  sendMessage(id: string, msg: string, sender_id: string, receiv_id: string): Observable<any> {
    return this.http.post(
      AUTH_API + "sendMessage",
      {
        conv_id: id,
        msg: msg,
        sender_id: sender_id,
        user_id: receiv_id
      },
      httpOptions
    );
  }

  seeMsgNotif(other_id: string, user_id: string): Observable<any> {
    return this.http.post(
      AUTH_API + "seeMsgNotif",
      {
        user_id: user_id,
        other_id: other_id
      },
      httpOptions
    );
  }
}
