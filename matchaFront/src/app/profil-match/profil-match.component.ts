import { Component, OnInit, Input } from '@angular/core';
import { User } from "@matcha/shared";
import { ActivatedRoute, Routes, Router, ActivatedRouteSnapshot } from '@angular/router';
import { userService } from '../_service/user_service';

@Component({
  selector: 'app-profil-match',
  template: `
  <p>email: {{user.email}}</p>
  <p>firstname: {{user.firstName}}</p>
  <p>lastName: {{user.lastName}}</p>
  <p>birthday: {{user.birthDate}}</p>
  <button (click)="like()">{{isLike}} like</button>
  `,
  styleUrls: ['./profil-match.component.scss']
})
export class ProfilMatchComponent implements OnInit {

  user: User;
  id = 0;
  isLike;

  constructor(public route: ActivatedRoute,
              private router: Router,
              private userService: userService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (!this.id || this.id == 0)
      this.router.navigate(['home/discover']);
    this.user = this.userService.setUserNull();
    this.userService.getUser(this.id).then(res => {
      if (!res || res === null || res['userName'] === null) {
        return this.router.navigate(['home/discover']);
      }
      this.user = {
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
        emailVerify: res["emailVerify"],
        profileComplete: res["profileComplete"],
        link: res["link"],
        pictures: [
          {id: "picture1", url: res["picture1"] as string},
          {id: "picture2", url: res["picture2"] as string},
          {id: "picture3", url: res["picture3"] as string},
          {id: "picture4", url: res["picture4"] as string},
          {id: "picture5", url: res["picture5"] as string},
          {id: "picture6", url: res["picture6"] as string},
        ]
      };
      this.userService.likeOrNot(JSON.parse(localStorage.getItem('id')), this.user.id).subscribe(
        data => {
          console.log(data);
          this.isLike = data.like;
        },
        err => {
        }
      );
    });
  }

  like() {
    this.userService.like(JSON.parse(localStorage.getItem('id')), this.user.id).then(res => {
      if (res === null)
        this.isLike = -1;
      else if (this.isLike == 0)
        this.isLike = 1;
      else
        this.isLike = 0;
    });
  }

}
