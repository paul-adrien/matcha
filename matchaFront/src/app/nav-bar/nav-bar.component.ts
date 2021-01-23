import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nav-bar',
  template: `
    <a class="case" *ngFor="let item of this.items" (click)="this.selectItem(item.id)" [routerLink]="item.route" routerLinkActive="active">

      <img [src]="item.selected ? item.src.check : item.src.default" >
    </a>
  `,
  styleUrls: ['./nav-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  public items = [
    {
      id: "profile",
      src: {
        check: "./assets/user-check.svg",
        default: "./assets/user.svg"
      },
      route: "profile",
      selected: true,
  },
  {
    id: "home",
    src: {
      check: "./assets/home.svg",
      default: "./assets/home.svg"
    },
    route: "discover",
    selected: false,
},
{
  id: "message",
  src: {
    check: "./assets/message-circle.svg",
    default: "./assets/message-circle.svg"
  },
  route: "profile",
  selected: false,
},
]

  constructor() { }

  ngOnInit(): void {
  }

  public selectItem(id: string) {
    this.items.forEach(item => {
      if (item.id === id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    })
  }

}
