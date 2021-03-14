import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import { Tags, User } from "@matcha/shared";
import { ActivatedRoute, Routes, Router, ActivatedRouteSnapshot } from "@angular/router";
import { userService } from "../_service/user_service";
import { differenceInHours, differenceInMinutes, differenceInYears } from "date-fns";
import { map, takeUntil } from "rxjs/operators";
import { combineLatest, Observable, Subject } from "rxjs";
import { Location } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { PopUpComponent } from "../pop-up/pop-up.component";

@Component({
  selector: "app-profile-view",
  template: `
    <img class="back" src="./assets/arrow-left.svg" (click)="this.backRoute()" />
    <div class="block">
      <img src="./assets/alert-circle.svg" (click)="this.isOpenDropdown = !this.isOpenDropdown" />
      <div
        (mouseleave)="this.isOpenDropdown = false"
        *ngIf="this.isOpenDropdown"
        class="dropdown-container"
      >
        <span (click)="block()" class="text">Bloquer le compte</span>
        <span (click)="report()" class="text">Signaler comme faux compte</span>
      </div>
    </div>
    <div class="big-profile-picture">
      <img
        class="chevron"
        [class.hidden]="!this.user?.pictures[0] || this.primaryPictureId === 0"
        (click)="this.primaryPictureId = this.primaryPictureId - 1"
        src="./assets/chevron-left.svg"
      />
      <img
        class="picture"
        [src]="
          this.user?.pictures[this.primaryPictureId] &&
          this.user?.pictures[this.primaryPictureId].url
            ? this.user?.pictures[this.primaryPictureId].url
            : './assets/user.svg'
        "
      />
      <img
        class="chevron"
        [class.hidden]="
          !this.user?.pictures[0] || !this.user?.pictures[this.primaryPictureId + 1].url
        "
        (click)="this.primaryPictureId = this.primaryPictureId + 1"
        src="./assets/chevron-right.svg"
      />
      <div (click)="this.like()" class="primary-button like">
        {{ this.isLike ? "Dislike" : "Like" }}
      </div>
      <div class="primary-button score">
        {{ this.user?.score }}
        <img src="./assets/star.svg" />
      </div>
    </div>
    <div class="content-name">
      <span>{{ this.user?.userName }} {{ this.getAge(this.user?.birthDate) }} ans</span>
      <span>{{ this.user?.firstName }} {{ this.user?.lastName }}</span>
      <span>{{ this.getLastConnectionText() }}</span>
    </div>
    <div class="form-container">
      <div class="info-container">
        <span class="info-top">Je suis</span>
        <span class="info-bottom">{{
          this.user?.gender !== undefined && this.genderOptions[this.user?.gender.toString()]
        }}</span>
      </div>
      <div class="info-container">
        <span class="info-top">Je veux rencontrer</span>
        <span class="info-bottom">{{
          this.user?.showMe !== undefined && this.showOptions[this.user?.showMe.toString()]
        }}</span>
      </div>
      <div class="info-container">
        <span class="info-top">Bio</span>
        <span class="info-bottom">{{ this.user?.bio }}</span>
      </div>
      <app-tags [showMode]="'true'"></app-tags>
    </div>
  `,
  styleUrls: ["./profile-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileViewComponent implements OnInit {
  public user: User;

  public primaryPictureId: number = 0;

  public isOpenDropdown = false;

  constructor(
    public route: ActivatedRoute,
    private location: Location,
    private userService: userService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router
  ) {}

  private unsubscribe = new Subject<void>();

  public genderOptions: { [key_id: string]: string } = {
    "1": "un Homme",
    "2": "une Femme",
    "3": "Kamoulox",
  };

  public showOptions: { [key_id: string]: string } = {
    "1": "des Hommes",
    "2": "des Femmes",
    "3": "les deux",
  };

  public isLike: boolean;

  public userId: string = this.route.snapshot.params.id;

  public yourTags$: Observable<Tags[]> = this.userService.getYourTags(this.userId).pipe(
    map(tags => tags),
    takeUntil(this.unsubscribe)
  );

  public allTags$: Observable<Tags[]> = this.userService.getAllTags().pipe(
    map(tags => tags),
    takeUntil(this.unsubscribe)
  );

  ngOnInit(): void {
    combineLatest([
      this.userService.getUser(this.userId),
      this.userService.likeOrNot(JSON.parse(localStorage.getItem("id")), this.userId),
    ]).subscribe(
      ([user, like]) => {
        this.user = user;
        if (like === 200) {
          this.isLike = true;
        } else {
          this.isLike = false;
        }
        this.cd.detectChanges();
      },
      err => {
        this.router.navigate(["/maintenance"]);
      }
    );

    this.yourTags$ = this.userService.getYourTags(this.userId).pipe(
      map(tags => tags),
      takeUntil(this.unsubscribe)
    );

    this.allTags$ = this.userService.getAllTags().pipe(
      map(tags => tags),
      takeUntil(this.unsubscribe)
    );

    this.userService.viewedProfil(JSON.parse(localStorage.getItem("id")), this.userId).subscribe(
      () => {},
      err => {
        this.router.navigate(["/maintenance"]);
      }
    );
  }

  like() {
    this.userService.like(JSON.parse(localStorage.getItem("id")), this.user.id).subscribe(
      res => {
        if (res === 200) {
          this.isLike = true;
        } else if (res === 205) {
          this.isLike = true;
          let dialogRef = this.dialog.open(PopUpComponent, {
            data: {
              title: "Super !",
              message: `${this.user?.userName} et vous avez matché !
            Envoyez un petit message ;)`,
            },
          });
        } else if (res === 201) {
          this.isLike = false;
        }
        console.log(res);
        console.log(this.isLike ? "like" : "dislike");
        this.cd.detectChanges();
      },
      err => {
        this.router.navigate(["/maintenance"]);
      }
    );
  }

  block() {
    this.userService.blockUser(JSON.parse(localStorage.getItem("id")), this.user.id).subscribe(
      res => {
        console.log(res);
      },
      err => {
        this.router.navigate(["/maintenance"]);
      }
    );
  }

  report() {
    this.userService.reportUser(JSON.parse(localStorage.getItem("id")), this.user.id).subscribe(
      res => {
        console.log(res);
      },
      err => {
        this.router.navigate(["/maintenance"]);
      }
    );
  }

  public getAge(birthDate: Date) {
    return differenceInYears(new Date(), new Date(birthDate));
  }

  public getLastConnectionText() {
    let lastConnection = this.user?.lastConnection;
    if (differenceInMinutes(new Date(), new Date(lastConnection)) < 60) {
      return (
        "En ligne il y a" + differenceInMinutes(new Date(), new Date(lastConnection)) + "minutes"
      );
    } else if (differenceInHours(new Date(), new Date(lastConnection)) < 24) {
      return "En ligne il y a" + differenceInHours(new Date(), new Date(lastConnection)) + "heures";
    } else {
      return "En ligne il y a plus de 24 heures";
    }
  }

  public backRoute() {
    this.location.back();
  }
}
