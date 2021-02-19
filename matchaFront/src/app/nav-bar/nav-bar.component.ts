import { Component, OnInit } from "@angular/core";
import { AuthService } from "../_service/auth_service";
import { interval } from 'rxjs';
import { userService } from '../_service/user_service';

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
    </div>
    <div (click)="this.logOut()" class="case">
      <img src="./assets/log-out.svg" />
    </div>
    <app-notification id="modal_1" class="hhidden">
        Dialog Header
        <button>Close Dialog</button>
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

  constructor(private authService: AuthService, private userService: userService) {
    interval(10000)
    .subscribe(x => this.userService.getNotifs(JSON.parse(localStorage.getItem("id")))
    .subscribe(
      data => {
        console.log(data);
        // this.notifs = data;
      },
      err => {
        console.log(err);
      }
    ))
  }

  ngOnInit(): void {}

  public selectItem(id: string) {
    this.items.forEach(item => {
      if (item.id === id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });

    this.userService.getNotifs(JSON.parse(localStorage.getItem("id"))).subscribe(
      data => {
        console.log(data);
        // this.notifs = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  public logOut() {
    this.authService.logOut();
  }

  showDialog(){
    let modal_t  = document.getElementById('modal_1')
    modal_t.classList.remove('hhidden')
    modal_t.classList.add('sshow');
  }
  closeDialog() {
    let modal_t  = document.getElementById('modal_1')
    modal_t.classList.remove('sshow')
    modal_t.classList.add('hhidden');
  }
}
