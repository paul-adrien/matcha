import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '@matcha/shared';
import { profilService } from '../_service/profil_service';
import { userService } from '../_service/user_service';

@Component({
  selector: 'discover',
  template: `
  <div class="content" *ngIf="this.user.profileComplete, else error">
    <div class="row">
      <div class="col-md-6 col-sm-6">
        <h2>Bienvenue {{user.firstName}} {{user.lastName}} </h2>
        <div style="width: 200px; height: 200px; background-color: grey;">PHOTO</div>
      </div>
      <div class="col-md-6 col-sm-6">
        <button type="button" class="btn btn-lg btn-primary" disabled>0 Like</button>
        <button type="button" class="btn btn-lg btn-primary" disabled>Score de popularité: 0</button>
      </div>
    </div>
    <div>
      <h3>Personnes ayant consulter votre profil</h3>
      <app-profil-card *ngFor="let User of usersViews; let i = index"
      [email]="User.email"
      [firstName]="User.firstName"
      [lastName]="User.lastName"
      [birthday]="User.birthday"
      [index]="i"
      [id]="User.id"></app-profil-card>
    </div>
    <div>
      <h3>Personnes qui vous ont likez</h3>
      <app-profil-card *ngFor="let User of userslike; let i = index"
      [email]="User.email"
      [firstName]="User.firstName"
      [lastName]="User.lastName"
      [birthday]="User.birthday"
      [index]="i"
      [id]="User.id"></app-profil-card>
    </div>
    <a (click)="viewProfils()"><button>Voir les profil qui match</button></a>
  </div>
  <ng-template #error>Complètes ton profil bg</ng-template>
  `,
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {

  public user: User;
  public usersViews = [];
  public userslike = [];

  constructor(private profilService: profilService, private userService: userService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.userService.setUserNull();
    this.userService.getUser(JSON.parse(localStorage.getItem('id'))).then(res => {
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
      this.profilService.takeViewProfil(this.user.id).subscribe(
        data => {
          console.log(data);
          if (data.status === true) {
            this.usersViews = data.users;
          }
        },
        err => {
        }
      );
      this.profilService.whoLikeMe(this.user.id).subscribe(
        data => {
          console.log(data);
          if (data.status === true) {
            this.userslike = data.users;
          }
        },
        err => {
        }
      );
    })
  }

  viewProfils() {
    this.router.navigate(["home/suggestion"]);
  }
}
