import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/auth_service';
import { User } from '@matcha/shared';


@Component({
  template: `
  <div class="logo">
    <img class="img" src="./assets/bd-logo.svg">
  </div>
  <div class="container-login">
    <div class="top-container">
      <div (click)="this.signInOrSignUp(false)" class="case" [class.select]="!this.loginMode">S'inscrire</div>
      <div (click)="this.signInOrSignUp(true)" class="case" [class.select]="this.loginMode">Se connecter</div>
    </div>
    <form class="form-container" *ngIf="!isLoggedIn" name="form" (ngSubmit)="f.form.valid && onSubmit()" #f="ngForm" novalidate>
        <input type="text"
          class="form-control"
          name="userName"
          [(ngModel)]="form.userName"
          minlength="3"
          maxlength="20"
          required
          #username="ngModel" placeholder="Nom d'utilisateur"/>
        <input *ngIf="!this.loginMode" type="text"
          class="form-control"
          name="lastName"
          [(ngModel)]="form.lastName"
          required
          minlength="3"
          maxlength="20"
          #name="ngModel" placeholder="Nom"/>
        <input *ngIf="!this.loginMode" type="text"
          class="form-control"
          name="FirstName"
          [(ngModel)]="form.firstName"
          required
          minlength="3"
          maxlength="20"
          #prenom="ngModel" placeholder="Prénom"/>
        <input *ngIf="!this.loginMode" type="email"
          class="form-control"
          name="email"
          [(ngModel)]="form.email"
          required
          email
          #email="ngModel" placeholder="Email"/>
        <input
          type="password"
          class="form-control"
          name="password"
          [(ngModel)]="form.password"
          required
          minlength="6"
          #password="ngModel" placeholder="Password"
        />
        <div *ngIf="this.loginMode">Se souvenir de moi</div>
        <button class="primary-button">{{this.loginMode ? "Se connecter" : "Créer un compte"}}</button>
        <a *ngIf="this.loginMode" routerLink="/forgotPass" routerLinkActive="active">Mot de passe oublié ?</a>
    </form>
  </div>
  `,
  styleUrls: ['./login-page.component.scss'],
  selector: "login-page"
})
export class LoginPageComponent implements OnInit {

  public loginMode = false;
  form: Partial<User> = {};
  isSuccessful = false;
  isSignUpFailed = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(public authService: AuthService, private route: Router ) { }

  ngOnInit(): void {
  }

  signInOrSignUp(loginMode: boolean) {
    this.loginMode = loginMode;
  }

  onSubmit()
  {
    if (this.loginMode === false)
    {
      this.authService.register(this.form).subscribe(
        data => {
          console.log(data);
          localStorage.setItem("user", JSON.stringify(data.user));
          this.route.navigate(["home/profile"])
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        },
        err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        }
      );
    }
    else
    {
      this.authService.login(this.form).subscribe(
        data => {
          console.log(data);
          this.isLoginFailed = false;
          localStorage.setItem("user", JSON.stringify(data.user));
          this.route.navigate(["home/profile"])
          //this.isLoggedIn = true;
          //window.location.reload();
        },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
    }
  }

}
