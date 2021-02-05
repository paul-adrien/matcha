import { userService } from "./../_service/user_service";
import { Component, OnInit } from "@angular/core";
import { User } from "@matcha/shared";

@Component({
  selector: "home",
  template: `
    <nav-bar></nav-bar>
    <div class="page">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(private userService: userService) {}

  public user: User;
  public token: string;

  ngOnInit(): void {}
}
