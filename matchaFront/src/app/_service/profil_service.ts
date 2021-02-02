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
export class profilService {
  constructor(private http: HttpClient) {}

  update(user: Partial<User>, saveEmail: string, completeProfile?: boolean): Observable<any> {
    return this.http.post(
      AUTH_API + "updateProfil",
      {
        userName: user.userName,
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        bio: user.bio,
        birthDate: user.birthDate,
        gender: user.gender,
        showMe: user.showMe,
        saveEmail: saveEmail,
        profileComplete: completeProfile || false,
      },
      httpOptions
    );
  }

  takeViewProfil(id): Observable<any> {
    return this.http.post(
      AUTH_API + "takeViewProfil",
      {
        user_id: id,
      },
      httpOptions
    );
  }

  whoLikeMe(id): Observable<any> {
    return this.http.post(
      AUTH_API + "whoLikeMe",
      {
        user_id: id,
      },
      httpOptions
    );
  }

  uploadPicture(picture: { url: string; id: string }, email: string): Observable<any> {
    return this.http.post(
      AUTH_API + "uploadPicture",
      {
        picture: picture,
        email,
      },
      httpOptions
    );
  }
}
