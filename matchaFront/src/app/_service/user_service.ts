import { Tags } from "./../../../libs/user";
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

  setUserNull() {
    return (this.user = {
      userName: "",
      firstName: "",
      lastName: "",
      birthDate: null,
      password: "",
      email: "",
      id: "",
      gender: undefined,
      showMe: undefined,
      bio: "",
      score: "",
      city: "",
      latitude: "",
      longitude: "",
      emailVerify: true,
      profileComplete: true,
      link: "",
      pictures: [
        { id: "picture1", url: "" as string },
        { id: "picture2", url: "" as string },
        { id: "picture3", url: "" as string },
        { id: "picture4", url: "" as string },
        { id: "picture5", url: "" as string },
        { id: "picture6", url: "" as string },
      ],
    });
  }

  getUser(id: string): Observable<User> {
    return this.http
      .post(
        AUTH_API + "getUser",
        {
          id: id,
        },
        httpOptions
      )
      .pipe(
        map(res => {
          return {
            userName: res["userName"],
            firstName: res["firstName"],
            lastName: res["lastName"],
            birthDate: res["birthDate"],
            password: res["password"],
            email: res["email"],
            id: res["id"],
            gender: res["gender"],
            showMe: res["showMe"],
            bio: res["bio"],
            score: res["score"],
            city: res["city"],
            latitude: res["latitude"],
            longitude: res["longitude"],
            emailVerify: res["emailVerify"] === "0" || !res["emailVerify"] ? false : true,
            profileComplete:
              res["profileComplete"] === "0" || !res["profileComplete"] ? false : true,
            link: res["link"],
            pictures: [
              { id: "picture1", url: res["picture1"] as string },
              { id: "picture2", url: res["picture2"] as string },
              { id: "picture3", url: res["picture3"] as string },
              { id: "picture4", url: res["picture4"] as string },
              { id: "picture5", url: res["picture5"] as string },
              { id: "picture6", url: res["picture6"] as string },
            ],
          };
        })
      );
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

  like(user_id, like_id) {
    return new Promise(resolve => {
      this.likehttp(user_id, like_id).subscribe(
        data => {
          console.log(data);
          if (data.status === true) {
            resolve(data.like);
          } else {
            resolve(null);
          }
        },
        err => {}
      );
    });
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
    return this.http.post(
      AUTH_API + "likeOrNot",
      {
        user_id: user_id,
        like_id: like_id,
      },
      httpOptions
    );
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
}
