import { AuthService } from "./../_service/auth_service";
import { userService } from "./../_service/user_service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { User } from "@matcha/shared";
import { Router } from "@angular/router";

@Component({
  selector: "home",
  template: `
    <div class="no-verify-container" *ngIf="this.user?.emailVerify === false; else good">
      <div class="title">Une petite vérification avant</div>
      <div class="text">
        Veulliez vérifiez vos mails, un mail de confirmation vous a été envoyé.
      </div>
      <div class="text">Vous n'avez rien reçu ?</div>
      <div (click)="this.resendMail()" class="primary-button">Renvoyer le mail</div>
    </div>
    <ng-template #good>
      <nav-bar></nav-bar>
      <div class="page">
        <router-outlet></router-outlet>
      </div>
    </ng-template>
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

  ngOnInit() {
    this.userService.getUser(localStorage.getItem("id")).subscribe(res => {
      this.user = res;
      this.cd.detectChanges();
    });
    this.route.navigate([""]);
  }

  public resendMail() {
    this.authService.resendVerify(this.user.id).subscribe();
  }
}
