import { Component, OnInit } from "@angular/core";
import { AuthService } from "../_service/auth_service";

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
    <div (click)="this.logOut()" class="case">
      <img src="./assets/log-out.svg" />
    </div>
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
        check: "./assets/home-check.svg",
        default: "./assets/home.svg",
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
      route: "profile",
      selected: false,
    },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

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
}
