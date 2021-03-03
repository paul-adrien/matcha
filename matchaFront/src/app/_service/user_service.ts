import { mapUserBackToUserFront, Notif, Tags } from "./../../../libs/user";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "@matcha/shared";
import { map } from "rxjs/operators";

const AUTH_API = "http://localhost:8080/api/";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class userService {
  user: User;

  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<User> {
    return this.http
      .get(AUTH_API + `users/${id}`, httpOptions)
      .pipe(map(res => mapUserBackToUserFront(res)));
  }

  getUserhttp(id): Observable<any> {
    return this.http.post(
      AUTH_API + "getUser",
      {
        id: id,
      },
      httpOptions
    );
  }

  like(user_id: string, like_id: string) {
    return this.likehttp(user_id, like_id);
  }

  likehttp(user_id, like_id): Observable<any> {
    return this.http.post(
      AUTH_API + "like",
      {
        user_id: user_id,
        like_id: like_id,
      },
      httpOptions
    );
  }

  likeOrNot(user_id, like_id): Observable<any> {
    return this.http.get(AUTH_API + `users/${user_id}/likeOrNot/${like_id}`, httpOptions);
  }

  getAllTags(): Observable<Tags[]> {
    return this.http.get<Tags[]>(AUTH_API + "getAllTags", httpOptions);
  }

  getYourTags(id: string): Observable<Tags[]> {
    return this.http.get<Tags[]>(AUTH_API + `getYourTags/${id}`, httpOptions);
  }

  addNonExistTag(name, id): Observable<any> {
    return this.http.post(
      AUTH_API + "addNonExistTag",
      {
        id: id,
        name: name,
      },
      httpOptions
    );
  }

  addExistTag(user_id, tag_id): Observable<any> {
    return this.http.post(
      AUTH_API + "addExistTag",
      {
        user_id: user_id,
        tag_id: tag_id,
      },
      httpOptions
    );
  }

  deleteTag(user_id, tag_id): Observable<any> {
    return this.http.post(
      AUTH_API + "deleteTag",
      {
        user_id: user_id,
        tag_id: tag_id,
      },
      httpOptions
    );
  }

  updateUserPosition(
    id: string,
    latitude: number,
    longitude: number,
    currentPosition: string
  ): Observable<any> {
    return this.http.post(
      AUTH_API + `user/${id}/update-position`,
      {
        latitude,
        longitude,
        currentPosition,
      },
      httpOptions
    );
  }

  viewedProfil(id: string, viewed_id: string): Observable<any> {
    return this.http.post(
      AUTH_API + `user/${id}/viewedProfil`,
      {
        viewed_id,
      },
      httpOptions
    );
  }

  getNotifs(id): Observable<any> {
    return this.http.get(AUTH_API + `users/${id}/getNotifs`, httpOptions);
  }

  seeNotifs(id): Observable<any> {
    return this.http.get(AUTH_API + `users/${id}/seeNotifs`, httpOptions);
  }
}
