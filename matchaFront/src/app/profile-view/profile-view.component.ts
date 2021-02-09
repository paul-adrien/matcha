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
import { differenceInYears } from "date-fns";
import { map, takeUntil } from "rxjs/operators";
import { Observable, Subject } from "rxjs";

@Component({
  selector: "app-profile-view",
  template: `
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
    </div>
    <div class="content-name">
      <span>{{ this.user?.userName }} {{ this.getAge(this.user?.birthDate) }} ans</span>
      <span>{{ this.user?.firstName }} {{ this.user?.lastName }}</span>
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
      <app-tags
        [yourTags]="this.yourTags$ | async"
        [allTags]="this.allTags$ | async"
        [showMode]="'true'"
      ></app-tags>
    </div>
  `,
  styleUrls: ["./profile-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileViewComponent implements OnInit {
  public user: User;

  public primaryPictureId: number = 0;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private userService: userService,
    private cd: ChangeDetectorRef
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

  public yourTags$: Observable<Tags[]> = this.userService
    .getYourTags(JSON.parse(localStorage.getItem("id")))
    .pipe(
      map(tags => tags),
      takeUntil(this.unsubscribe)
    );

  public allTags$: Observable<Tags[]> = this.userService.getAllTags().pipe(
    map(tags => tags),
    takeUntil(this.unsubscribe)
  );

  ngOnInit(): void {
    this.route.params.subscribe(params =>
      this.userService.getUser(params.id).subscribe(data => {
        this.user = data;
        this.cd.detectChanges();
      })
    );
    //this.userService.getUser(this.route.params.)
    // this.id = this.route.snapshot.params["id"];
    // if (!this.id || this.id == 0) this.router.navigate(["home/discover"]);
    // this.user = this.userService.setUserNull();
  }

  // like() {
  //   this.userService.like(JSON.parse(localStorage.getItem("id")), this.user.id).then(res => {
  //     if (res === null) this.isLike = -1;
  //     else if (this.isLike == 0) this.isLike = 1;
  //     else this.isLike = 0;
  //   });
  // }

  public getAge(birthDate: Date) {
    return differenceInYears(new Date(), new Date(birthDate));
  }
}
