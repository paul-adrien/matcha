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
    <app-suggestion></app-suggestion>
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
        [user]="userSuggestion"
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
export class DiscoverComponent implements OnInit {
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

  ngOnInit() {
    this.getCurrentLocation();
    this.matchService.getSuggestion(localStorage.getItem("id")).subscribe(el => console.log(el));
  }

  viewProfils() {
    this.router.navigate(["home/suggestion"]);
  }

  public getCurrentLocation() {
    if (
      typeof navigator.geolocation === "object" &&
      typeof navigator.geolocation.getCurrentPosition === "function"
    ) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          this.userService
            .updateUserPosition(JSON.parse(localStorage.getItem("id")), lat, long)
            .subscribe(el => console.log(el));
        },
        error => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.log("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.log("The request to get user location timed out.");
              break;
          }
        },
        { timeout: 10000 }
      );
    }
  }
}
