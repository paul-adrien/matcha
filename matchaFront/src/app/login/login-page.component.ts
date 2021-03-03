import { Router } from "@angular/router";
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from "../_service/auth_service";
import { User } from "@matcha/shared";
import { FormControl, FormGroup } from '@angular/forms';

function ValidatorLength(control: FormControl) {
  if (control.value?.length < 3) {
    return { error: "3 caractères minimum" };
  } else if (control.value?.length > 20) {
    return { error: "20 caractères maximum" };
  }
}

function ValidatorEmail(control: FormControl) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(control.value).toLowerCase())) {
    return { error: "Mauvais format" };
  }
}

function ValidatorPass(control: FormControl) {
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!re.test(String(control.value).toLowerCase())) {
    return { error: "le mot de passe doit comporter minimum 8 caractères, un chiffre et un caractère spéciale" };
  }
}

@Component({
  template: `
    <div class="logo">
      <img class="img" src="./assets/bd-logo.svg" />
    </div>
    <div class="container-login">
      <div class="top-container">
        <div (click)="this.signInOrSignUp(false)" class="case" [class.select]="!this.loginMode">
          S'inscrire
        </div>
        <div (click)="this.signInOrSignUp(true)" class="case" [class.select]="this.loginMode">
          Se connecter
        </div>
      </div>
      <form
        [formGroup]="this.registerForm"
        class="form-container"
        *ngIf="!isLoggedIn && !this.loginMode"
        name="form"
        (ngSubmit)="f.form.valid && onSubmit()"
        #f="ngForm"
        novalidate
      >
        <input
            type="text"
            formControlName="userName"
            id="userName"
            required
            placeholder="Nom d'utilisateur"
        />
        <div class="error" *ngIf="this.registerForm.get('userName').errors?.error && this.isSuccessful === false">
          {{ this.registerForm.get("userName").errors.error }}
        </div>
        <input
          *ngIf="!this.loginMode"
          type="text"
          formControlName="lastName"
          required
          placeholder="Nom"
        />
        <div class="error" *ngIf="this.registerForm.get('lastName').errors?.error && !this.loginMode && this.isSuccessful === false">
          {{ this.registerForm.get("lastName").errors.error }}
        </div>
        <input
          *ngIf="!this.loginMode"
          type="text"
          formControlName="firstName"
          required
          placeholder="Prénom"
        />
        <div class="error" *ngIf="this.registerForm.get('firstName').errors?.error && !this.loginMode && this.isSuccessful === false">
          {{ this.registerForm.get("firstName").errors.error }}
        </div>
        <input
          *ngIf="!this.loginMode"
          formControlName="email"
          required
          placeholder="Email"
        />
        <div class="error" *ngIf="this.registerForm.get('email').errors?.error && this.isSuccessful === false && !this.loginMode">
          {{ this.registerForm.get("email").errors.error }}
        </div>
        <input
          *ngIf="!this.loginMode"
          type="password"
          formControlName="password"
          required
          placeholder="Mot de passe"
        />
        <div class="error" *ngIf="this.registerForm.get('password').errors?.error && this.isSuccessful === false && !this.loginMode">
          {{ this.registerForm.get("password").errors.error }}
        </div>
        <input
          *ngIf="this.loginMode"
          type="password"
          formControlName="passwordLogin"
          required
          placeholder="Mot de passe"
        />
        <button class="primary-button" (click)="test()">
          {{ this.loginMode ? "Se connecter" : "Créer un compte" }}
        </button>
      </form>
      <form
        [formGroup]="this.loginForm"
        class="form-container"
        *ngIf="!isLoggedIn && this.loginMode"
        name="form"
        (ngSubmit)="f.form.valid && onSubmit()"
        #f="ngForm"
        novalidate
      >
        <input
            type="text"
            formControlName="userName"
            id="userName"
            required
            placeholder="Nom d'utilisateur"
        />
        <div class="error" *ngIf="this.loginForm.get('userName').errors?.error && this.isSuccessful === false">
          {{ this.loginForm.get("userName").errors.error }}
        </div>
        <input
          type="password"
          formControlName="password"
          required
          placeholder="Mot de passe"
        />
        <button class="primary-button" (click)="test()">
          {{ this.loginMode ? "Se connecter" : "Créer un compte" }}
        </button>
      </form>
      <a *ngIf="this.loginMode" routerLink="/forgotPass" routerLinkActive="active"
        >Mot de passe oublié ?
      </a>
      <p>{{ errorMessage }}</p>
    </div>
  `,
  styleUrls: ["./login-page.component.scss"],
  selector: "login-page",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {

  public registerForm = new FormGroup({
    userName: new FormControl("", ValidatorLength),
    firstName: new FormControl("", ValidatorLength),
    lastName: new FormControl("", ValidatorLength),
    password: new FormControl("", ValidatorPass),
    email: new FormControl("", ValidatorEmail)
  });

  public loginForm = new FormGroup({
    userName: new FormControl("", ValidatorLength),
    password: new FormControl("")
  });

  public loginMode = false;
  isSuccessful = true;
  isSignUpFailed = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = "";

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit(): void {}

  signInOrSignUp(loginMode: boolean) {
    this.loginMode = loginMode;
  }

  test() {
    this.isSuccessful = false;
  }

  onSubmit() {
    if (this.loginMode === false) {
      const form: Partial<User> = this.registerForm.getRawValue();
      this.authService.register(form).subscribe(
        data => {
          console.log(data);
          if (data.status === true) {
            localStorage.clear();
            localStorage.setItem("id", JSON.stringify(data.user["id"]));
            localStorage.setItem("token", JSON.stringify(data.token));
            this.route.navigate(["home/discover"]);
            this.isSuccessful = true;
            this.isSignUpFailed = false;
          }
        },
        err => {
          this.route.navigate(["/maintenance"]);
          this.isSignUpFailed = true;
        }
      );
    } else {
      const form: Partial<User> = this.loginForm.getRawValue();
      this.authService.login(form).subscribe(
        data => {
          console.log(data);
          if (data.status === true) {
            this.isLoginFailed = false;
            localStorage.clear();
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("id", JSON.stringify(data.user["id"]));
            localStorage.setItem("token", JSON.stringify(data.token));
            this.route.navigate(["/home/discover"]);
            //this.isLoggedIn = true;
            //window.location.reload();
          } else {
            this.errorMessage = data.message;
          }
        },
        err => {
            this.route.navigate(["/maintenance"]);
          this.isLoginFailed = true;
        }
      );
    }
  }

}
