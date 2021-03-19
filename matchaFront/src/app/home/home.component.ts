import { AuthService } from "./../_service/auth_service";
import { userService } from "./../_service/user_service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { User } from "@matcha/shared";
import { Router } from "@angular/router";

@Component({
  selector: "home",
  template: `
    <div class="container">
      <div class="no-verify-container" *ngIf="this.user?.emailVerify === false; else good">
        <div class="title">Une petite vérification avant</div>
        <div class="text">
          Veulliez vérifiez vos mails, un mail de confirmation vous a été envoyé.
        </div>
        <div class="text">Vous n'avez rien reçu ?</div>
        <div (click)="this.resendMail()" class="primary-button">Renvoyer le mail</div>

        <div class="back" (click)="this.logOut()">Retouner sur la page de login</div>
      </div>
      <ng-template #good>
        <nav-bar [selectedId]="this.idNavBar"></nav-bar>
        <div class="page">
          <router-outlet></router-outlet>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  constructor(
    private userService: userService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private route: Router
  ) {}

  public user: User;
  public token: string;
  public idNavBar = "";

  ngOnInit() {
    localStorage.setItem("theme", "light");
    this.userService.getUser(localStorage.getItem("id")).subscribe(
      res => {
        this.user = res;
        this.cd.detectChanges();
      },
      err => {
        this.route.navigate(["/maintenance"]);
      }
    );
    if (this.route.url.includes("profile") && !this.route.url.includes("profile-")) {
      this.idNavBar = "profile";
    } else if (this.route.url.includes("messaging") || this.route.url.includes("discussion/")) {
      this.idNavBar = "message";
    }
  }

  public logOut() {
    this.authService.logOut();
  }

  public resendMail() {
    this.authService.resendVerify(this.user.id, this.user.email).subscribe(
      () => {},
      err => {
        this.route.navigate(["/maintenance"]);
      }
    );
  }
}
