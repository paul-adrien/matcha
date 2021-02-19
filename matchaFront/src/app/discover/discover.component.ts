import { matchService } from "./../_service/match_service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { User } from "@matcha/shared";
import { profilService } from "../_service/profil_service";
import { userService } from "../_service/user_service";
import { map, switchMap } from "rxjs/operators";

@Component({
  selector: "discover",
  template: `
    <app-suggestion (usersSort)="this.getUsersFilter($event)"></app-suggestion>
    <div
      class="suggestion-container"
      *ngIf="
        (this.user$ | async)?.profileComplete !== undefined &&
          (this.user$ | async)?.profileComplete &&
          (this.usersSuggestion$ | async) !== undefined;
        else error
      "
    >
      <div class="content-filter">
        <app-profil-card
          [user]="userSuggestion"
          *ngFor="let userSuggestion of this.usersSuggestion$ | async"
        ></app-profil-card>
      </div>
    </div>
    <div class="filter-container">
      <span>Résultat du filtre ou sort</span>
      <div class="content-filter">
        <app-profil-card
          [user]="userFilter"
          *ngFor="let userFilter of this.usersFilter"
        ></app-profil-card>
      </div>
    </div>
    <ng-template #error>Complètes ton profil bg</ng-template>
  `,
  styleUrls: ["./discover.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverComponent implements OnInit {
  public user$: Observable<User>;
  public usersSuggestion$: Observable<User[]>;
  public usersViews = [];
  public userslike = [];
  public usersFilter = [];

  constructor(
    private profilService: profilService,
    private matchService: matchService,
    private userService: userService,
    private router: Router,
    private cd: ChangeDetectorRef
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
    let lat = undefined;
    let long = undefined;
    if (
      typeof navigator.geolocation === "object" &&
      typeof navigator.geolocation.getCurrentPosition === "function"
    ) {
      navigator.geolocation.getCurrentPosition(
        position => {
          lat = position.coords.latitude;
          long = position.coords.longitude;
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
          this.userService
            .updateUserPosition(JSON.parse(localStorage.getItem("id")), lat, long)
            .subscribe(el => console.log(el));
        },
        { timeout: 5000 }
      );
    }
  }

  public getUsersFilter(res: User[]) {
    this.usersFilter = res;
  }
}
