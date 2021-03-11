import { map } from "rxjs/operators";
import { User } from "./../../../libs/user";
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
} from "@angular/core";
import { AuthService } from "../_service/auth_service";
import { interval } from "rxjs";
import { userService } from "../_service/user_service";
import { Notif } from "../../../libs/user";
import { Route } from "@angular/compiler/src/core";
import { Router } from "@angular/router";

@Component({
  selector: "nav-bar",
  template: `
    <a
      class="case"
      *ngFor="let item of this.items"
      [routerLink]="item.route"
      routerLinkActive="active"
      (click)="this.selectItem(item.id)"
    >
      <img [src]="item.selected ? item.src.check : item.src.default" />
    </a>
    <div class="case">
      <img src="./assets/bell.svg" (click)="showDialog()" />
      <div *ngIf="this.nbUnViewNotif > 0" class="notif-circle">
        {{ nbUnViewNotif }}
      </div>
      <app-notification *ngIf="notifs?.length > 0; else noNotif" id="modal_1" class="hhidden">
        <div *ngFor="let notif of notifs" class="notif-text">
          <span (click)="notif.type === 'msg' ? viewMsg() : viewProfil(notif.sender_id)">{{
            this.getMessageNotif(notif)
          }}</span>
          <span>{{ notif.date | date: "HH:mm" }}</span>
        </div>
      </app-notification>
      <ng-template #noNotif>
        <app-notification id="modal_1" class="hhidden">
          <div class="notif-text">Aucune notification</div>
        </app-notification>
      </ng-template>
    </div>
    <div class="case">
      <img (click)="this.logOut()" src="./assets/log-out.svg" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./nav-bar.component.scss"],
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  @Input() public selectedId = "";

  public items = [
    {
      id: "profile",
      src: {
        check: "./assets/user-check.svg",
        default: "./assets/user.svg",
      },
      route: "profile",
      selected: false,
    },
    {
      id: "home",
      src: {
        check: "./assets/new-home-check.svg",
        default: "./assets/new-home.svg",
      },
      route: "discover",
      selected: true,
    },
    {
      id: "message",
      src: {
        check: "./assets/message-circle-check.svg",
        default: "./assets/message-circle.svg",
      },
      route: "messaging",
      selected: false,
    },
  ];

  nbUnViewNotif = 0;
  notifs: Notif[];
  notifInter: any;

  constructor(
    private authService: AuthService,
    private userService: userService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.selectedId) {
      this.selectItem(this.selectedId);
    }
    this.userService.getNotifs(JSON.parse(localStorage.getItem("id"))).subscribe(
      data => {
        console.log(data);
        this.notifs = data.notifs;
        this.nbUnViewNotif = data.nbUnView;
        this.cd.detectChanges();
      },
      err => {
        console.log(err);
      }
    );
    this.notifInter = setInterval(x => {
      this.userService.getNotifs(JSON.parse(localStorage.getItem("id"))).subscribe(
        data => {
          console.log(data);
          this.notifs = data.notifs;
          this.nbUnViewNotif = data.nbUnView;
          this.cd.detectChanges();
        },
        err => {
          console.log(err);
        }
      );
    }, 10000);
  }

  ngOnDestroy() {
    if (this.notifInter) {
      clearInterval(this.notifInter);
    }
  }

  public selectItem(id: string) {
    this.items.forEach(item => {
      if (item.id === id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    this.cd.detectChanges();
  }

  public logOut() {
    this.authService.logOut();
  }

  showDialog() {
    let modal_t = document.getElementById("modal_1");
    modal_t.classList.remove("hhidden");
    modal_t.classList.add("sshow");
    this.userService.seeNotifs(JSON.parse(localStorage.getItem("id"))).subscribe();
    this.userService.getNotifs(JSON.parse(localStorage.getItem("id"))).subscribe(
      data => {
        console.log(data);
        this.nbUnViewNotif = data.nbUnView;
        this.notifs = data.notifs;
        this.cd.detectChanges();
      },
      err => {
        console.log(err);
      }
    );
    this.nbUnViewNotif = 0;
  }

  closeDialog() {
    let modal_t = document.getElementById("modal_1");
    modal_t.classList.remove("sshow");
    modal_t.classList.add("hhidden");
    this.nbUnViewNotif = 0;
  }

  viewProfil(id) {
    this.closeDialog();
    this.router.navigate(["home/profile-view/" + id]);
  }

  viewMsg() {
    this.closeDialog();
    this.selectItem("message");
    this.router.navigate(["home/messaging"]);
  }

  getMessageNotif(notif: Notif) {
    switch (notif.type) {
      case "msg":
        return notif.otherUserName + " a envoyé un message.";
      case "view":
        return notif.otherUserName + " a regardé votre profil.";
      case "matched":
        return notif.otherUserName + " et vous avez matché ensemble.";
      case "unMatched":
        return notif.otherUserName + " a supprimé son match.";
      case "like":
        return notif.otherUserName + " a aimé votre profil.";
    }
  }
}
