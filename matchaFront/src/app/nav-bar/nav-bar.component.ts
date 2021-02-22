import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from "../_service/auth_service";
import { interval } from 'rxjs';
import { userService } from '../_service/user_service';
import { Notif } from '../../../libs/user';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: "nav-bar",
  template: `
    <a
      class="case"
      *ngFor="let item of this.items"
      (click)="this.selectItem(item.id)"
      [routerLink]="item.route"
      routerLinkActive="active"
    >
      <img [src]="item.selected ? item.src.check : item.src.default" />
    </a>
    <div class="case" (click)="showDialog()">
      <img src="./assets/notification-bell-svgrepo-com.svg" />
      <p style="color: white; padding: 3px 6px; border-radius: 6px" [ngStyle]="{'background-color': nbUnViewNotif <= 0 ? 'white' : 'red'}">{{nbUnViewNotif}}</p>
    </div>
    <div (click)="this.logOut()" class="case">
      <img src="./assets/log-out.svg" />
    </div>
    <app-notification id="modal_1" class="hhidden">
      <div  *ngFor="let Notif of notifs">
        <div *ngIf="Notif.type === 'msg'" (click)="viewMsg()">
          <p [ngStyle]="{'font-weight': Notif.see == 0 ? 'bold' : 'normal'}">{{ Notif.type }} {{ Notif.otherId }} {{ Notif.date }}</p>
        </div>
        <div *ngIf="Notif.type !== 'msg'" (click)="viewProfil(Notif.otherId)">
          <p [ngStyle]="{'font-weight': Notif.see == 0 ? 'bold' : 'normal'}">{{ Notif.type }} {{ Notif.otherId }} {{ Notif.date }}</p>
        </div>
      </div>
    </app-notification>
  `,
  styleUrls: ["./nav-bar.component.scss"],
})
export class NavigationBarComponent implements OnInit {
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
        check: "./assets/message-circle.svg",
        default: "./assets/message-circle.svg",
      },
      route: "messaging",
      selected: false,
    },
  ];

  nbUnViewNotif = 0;
  notifs: Notif[];

  constructor(private authService: AuthService, private userService: userService, private cd: ChangeDetectorRef, private router: Router) {
    interval(10000)
    .subscribe(x => this.userService.getNotifs(JSON.parse(localStorage.getItem("id")))
    .subscribe(
      data => {
        console.log(data);
        this.notifs = data.notifs;
        this.nbUnViewNotif = data.nbUnView;
        this.cd.detectChanges();
      },
      err => {
        console.log(err);
      }
    ))
  }

  ngOnInit(): void {
    this.userService.getNotifs(JSON.parse(localStorage.getItem("id")))
    .subscribe(
      data => {
        console.log(data);
        this.nbUnViewNotif = data.nbUnView;
        this.notifs = data.notifs;
      },
      err => {
        console.log(err);
      }
    )
  }

  public selectItem(id: string) {
    this.items.forEach(item => {
      if (item.id === id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
  }

  public logOut() {
    this.authService.logOut();
  }

  showDialog(){
    let modal_t  = document.getElementById('modal_1')
    modal_t.classList.remove('hhidden')
    modal_t.classList.add('sshow');
    this.userService.seeNotifs(JSON.parse(localStorage.getItem("id")))
    .subscribe();
    this.userService.getNotifs(JSON.parse(localStorage.getItem("id")))
    .subscribe(
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
    let modal_t  = document.getElementById('modal_1');
    modal_t.classList.remove('sshow');
    modal_t.classList.add('hhidden');
    this.nbUnViewNotif = 0;
  }

  viewProfil(id) {
    this.router.navigate(["home/profile-view/" + id]);
  }

  viewMsg() {
    this.router.navigate(["home/messaging"]);
  }
}
