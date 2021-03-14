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
    <div class="header-bar">
      <span
        class="case separator"
        [class.selected]="this.updateMode"
        (click)="changeSuggestionMode(true)"
        >Suggestion</span
      >
      <span class="case" [class.selected]="!this.updateMode" (click)="changeSuggestionMode(false)"
        >Recherche</span
      >
    </div>
    <div class="filter-button" *ngIf="this.updateMode">
      <span class="primary-button" (click)="this.isShowFilter = true"> Filtrer ou trier </span>
      <div class="filter-pop-up" *ngIf="this.isShowFilter">
        <img (click)="this.isShowFilter = false" class="cross" src="./assets/x.svg" />
        <app-filter-and-sort
          [isSuggestion]="true"
          (usersSort)="this.getUsersFilter($event)"
        ></app-filter-and-sort>
      </div>
    </div>
    <app-filter-and-sort
      *ngIf="!this.updateMode"
      (usersSort)="this.getUsersFilter($event)"
    ></app-filter-and-sort>
    <div class="suggestion-container" *ngIf="(this.user$ | async)?.profileComplete; else error">
      <div
        *ngIf="this.updateMode && this.usersSuggestion$ | async as usersSuggestions; else filter"
      >
        <div class="content-filter" *ngIf="usersSuggestions?.length > 0">
          <app-interactive-map
            [users]="this.usersSuggestions"
            [me]="this.user$ | async"
          ></app-interactive-map>
          <app-profil-card
            *ngFor="let userSuggestion of usersSuggestions"
            [user]="userSuggestion"
          ></app-profil-card>
        </div>
        <div *ngIf="usersSuggestions?.length === 0" #noResult>
          <span>Aucun résultat</span>
        </div>
      </div>
      <ng-template #filter>
        <div *ngIf="!this.updateMode && this.usersFilter$ | async as usersFilters; else loading">
          <div class="content-filter" *ngIf="usersFilters?.length > 0">
            <app-interactive-map
              [users]="this.usersFilters"
              [me]="this.user$ | async"
            ></app-interactive-map>
            <app-profil-card
              *ngFor="let userFilter of this.usersFilters"
              [user]="userFilter"
            ></app-profil-card>
          </div>
          <div *ngIf="usersFilters?.length === 0" #noResult>
            <span>Aucun résultat</span>
          </div>
        </div>
      </ng-template>
      <ng-template #loading>
        <mat-spinner class="spinner"></mat-spinner>
      </ng-template>
    </div>
    <ng-template #error><span> Complètes ton profil bg </span> </ng-template>
  `,
  styleUrls: ["./discover.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverComponent implements OnInit {
  public user$: Observable<User>;
  public usersSuggestion$: Observable<User[]>;
  public usersFilter$: Observable<User[]>;

  public usersViews = [];
  public userslike = [];
  public usersFilter = [];

  public updateMode = true;

  public isShowFilter = false;

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
  }

  public changeSuggestionMode(value: boolean) {
    this.updateMode = value;
    this.isShowFilter = false;
  }

  public getCurrentLocation() {
    let lat = undefined;
    let long = undefined;
    this.userService.getUser(JSON.parse(localStorage.getItem("id"))).subscribe(userRes => {
      if (
        typeof navigator.geolocation === "object" &&
        typeof navigator.geolocation.getCurrentPosition === "function" &&
        userRes?.currentPosition
      ) {
        navigator.geolocation.getCurrentPosition(
          position => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            this.userService
              .updateUserPosition(JSON.parse(localStorage.getItem("id")), lat, long, "1")
              .subscribe(el => console.log(),
              err => {
                this.router.navigate(["/maintenance"]);
              });
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
              .updateUserPosition(JSON.parse(localStorage.getItem("id")), lat, long, "1")
              .subscribe(el => console.log(),
              err => {
                this.router.navigate(["/maintenance"]);
              });
          },
          { timeout: 5000 }
        );
      }
    });
    this.cd.detectChanges();
  }

  public getUsersFilter(res: Observable<User[]>) {
    this.isShowFilter = false;
    if (this.updateMode) {
      this.usersSuggestion$ = res;
    } else if (!this.updateMode) {
      this.usersFilter$ = res;
    }
    this.cd.detectChanges();
  }
}
