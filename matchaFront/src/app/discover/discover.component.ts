import { matchService } from "./../_service/match_service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { Component, Input, OnInit } from "@angular/core";
import { User } from "@matcha/shared";
import { profilService } from "../_service/profil_service";
import { userService } from "../_service/user_service";

@Component({
  selector: "discover",
  template: `
    <div
      *ngIf="
        (this.user$ | async)?.profileComplete !== undefined &&
          (this.user$ | async)?.profileComplete &&
          (this.usersSuggestion$ | async) !== undefined;
        else error
      "
      class="content-suggestion"
    >
      <app-profil-card [user]="this.user$ | async"></app-profil-card>
      <app-profil-card
        *ngFor="let userSuggestion of this.usersSuggestion$ | async"
      ></app-profil-card>
      <!--
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
    </div>-->
      <app-profil-card (click)="viewProfils()"
        ><button>Voir les profil qui match</button></app-profil-card
      >
    </div>
    <ng-template #error>Complètes ton profil bg</ng-template>
  `,
  styleUrls: ["./discover.component.scss"],
})
export class DiscoverComponent {
  public user$: Observable<User>;
  public usersSuggestion$: Observable<User[]>;
  public usersViews = [];
  public userslike = [];

  constructor(
    private profilService: profilService,
    private matchService: matchService,
    private userService: userService,
    private router: Router
  ) {
    this.user$ = this.userService.getUser(JSON.parse(localStorage.getItem("id")));
    this.usersSuggestion$ = this.matchService.getSuggestion(localStorage.getItem("id"));
  }

  viewProfils() {
    this.router.navigate(["home/suggestion"]);
  }
}
