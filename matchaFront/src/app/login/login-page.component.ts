import { Component, OnInit } from '@angular/core';

@Component({
  template: `
  <div class="cow">
    <img class="img" src="./assets/cow.svg">
  </div>
  <div class="cow-2">
    <img class="img" src="./assets/cow.svg">
  </div>
  <div class="logo">
    <img class="img" src="./assets/logo-matcha.svg">
    <img class="img" src="./assets/slogan.svg">
  </div>
  <div class="container-login">
    <div class="top-container">
      <div (click)="this.signInOrSignUp(false)" class="case" [class.select]="!this.loginMode">S'inscrire</div>
      <div (click)="this.signInOrSignUp(true)" class="case" [class.select]="this.loginMode">Se connecter</div>
    </div>
    <div class="form-container">
      <input placeholder="Email">
      <input placeholder="Password">
      <input *ngIf="!this.loginMode" placeholder="Confirm Password">
      <div *ngIf="this.loginMode">Se souvenir de moi</div>
      <div class="primary-button">{{this.loginMode ? "Se connecter" : "Créer un compte"}}</div>
      <div *ngIf="this.loginMode">Mot de passe oublié ?</div>

    </div>
  </div>
  `,
  styleUrls: ['./login-page.component.scss'],
  selector: "login-page"
})
export class LoginPageComponent implements OnInit {

  public loginMode = false;

  constructor() { }

  ngOnInit(): void {
  }

  signInOrSignUp(loginMode: boolean) {
    this.loginMode = loginMode;
  }

}
