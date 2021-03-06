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
import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInYears,
  format,
} from "date-fns";
import { map, takeUntil } from "rxjs/operators";
import { combineLatest, Observable, Subject } from "rxjs";
import { formatDate, Location } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { PopUpComponent } from "../pop-up/pop-up.component";

declare var google: any;

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
    </div>
    <div class="info-city-connection">
      <span class="last-connection" *ngIf="this.isLikeMe == 1">Vous avez matché ensemble</span>
      <span class="last-connection" *ngIf="this.isLikeMe == 2">Vous like</span>
      <div class="last-connection">
        <img [src]="this.isLog ? './assets/circle.svg' : './assets/moon.svg'" />
        {{ this.getLastConnectionText() }}
      </div>
      <div class="city">
        <img src="./assets/map-pin.svg" />
        {{ this.city }}
      </div>
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

  public city = "";

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
  public isLikeMe: number = 0;

  public isLog = false;

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
      this.userService.likeOrNot(this.userId, JSON.parse(localStorage.getItem("id"))),
    ]).subscribe(
      ([user, like, likeMe]) => {
        this.user = user;
        if (like === 200) {
          this.isLike = true;
        } else {
          this.isLike = false;
        }
        if (likeMe === 200 && like === 200) {
          this.isLikeMe = 1;
        } else if (likeMe === 200) {
          this.isLikeMe = 2;
        } else {
          this.isLikeMe = 0;
        }
        this.getCity();
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
          this.isLikeMe = 1;
          let dialogRef = this.dialog.open(PopUpComponent, {
            data: {
              title: "Super !",
              message: `${this.user?.userName} et vous avez matché !
            Envoyez un petit message ;)`,
            },
          });
        } else if (res === 201) {
          this.isLike = false;
          this.isLikeMe = 2;
        }
        this.cd.detectChanges();
      },
      err => {
        this.router.navigate(["/maintenance"]);
      }
    );
  }

  block() {
    this.userService.blockUser(JSON.parse(localStorage.getItem("id")), this.user.id).subscribe(
      res => {},
      err => {
        this.router.navigate(["/maintenance"]);
      }
    );
  }

  report() {
    this.userService.reportUser(JSON.parse(localStorage.getItem("id")), this.user.id).subscribe(
      res => {},
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
    if (differenceInSeconds(new Date(), new Date(lastConnection)) < 60) {
      this.isLog = true;
      return "En ligne actuellement";
    } else if (differenceInMinutes(new Date(), new Date(lastConnection)) < 60) {
      this.isLog = false;
      return (
        "En ligne il y a " + differenceInMinutes(new Date(), new Date(lastConnection)) + " minutes"
      );
    } else if (differenceInHours(new Date(), new Date(lastConnection)) < 24) {
      this.isLog = false;
      return (
        "En ligne il y a " + differenceInHours(new Date(), new Date(lastConnection)) + " heures"
      );
    } else if (lastConnection !== undefined) {
      this.isLog = false;
      return "En ligne pour la dernière fois le " + format(new Date(lastConnection), "dd/MM/yyyy");
    }
  }

  public getCity() {
    let result;
    if (this.user?.latitude && this.user?.longitude) {
      let geocoder = new google.maps.Geocoder();

      var geolocate = new google.maps.LatLng(
        parseFloat(this.user?.latitude),
        parseFloat(this.user?.longitude)
      );

      geocoder.geocode({ latLng: geolocate }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results.length > 1) {
            result = results[1];
          } else {
            result = results[0];
          }
          this.city =
            result.address_components[2].long_name + ", " + result.address_components[3].long_name;
          this.cd.detectChanges();
        }
      });
    }
  }

  public backRoute() {
    this.location.back();
  }
}
