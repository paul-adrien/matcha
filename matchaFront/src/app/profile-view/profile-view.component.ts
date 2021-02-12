import { Component, OnInit, Input } from "@angular/core";
import { User } from "@matcha/shared";
import { ActivatedRoute, Routes, Router, ActivatedRouteSnapshot } from "@angular/router";
import { userService } from "../_service/user_service";

@Component({
  selector: "app-profile-view",
  template: `
    <p>email: {{ user.email }}</p>
    <p>firstname: {{ user.firstName }}</p>
    <p>lastName: {{ user.lastName }}</p>
    <p>birthday: {{ user.birthDate }}</p>
    <button (click)="like()">{{ isLike }} like</button>
  `,
  styleUrls: ["./profile-view.component.scss"],
})
export class ProfileViewComponent implements OnInit {
  user: User;
  id = 0;
  isLike;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private userService: userService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"];
    if (!this.id || this.id == 0) this.router.navigate(["home/discover"]);
    this.user = this.userService.setUserNull();
  }

  like() {
    this.userService.like(JSON.parse(localStorage.getItem("id")), this.id).then(res => {
      if (res === null) this.isLike = -1;
      else if (this.isLike == 0) this.isLike = 1;
      else this.isLike = 0;
    });
  }
}
