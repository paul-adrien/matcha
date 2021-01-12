import { Component, OnInit } from '@angular/core';

@Component({
  template: `
  <div class="logo">
    <img class="img" src="./assets/logo-matcha.svg">
    <img class="img" src="./assets/slogan.svg">
  </div>
  <div class="container-login">
    <div class="top-container">
      <div (click)="this.signInOrSignUp(false)" class="case" [class.select]="!this.loginMode">S'inscrire</div>
      <div (click)="this.signInOrSignUp(true)" class="case" [class.select]="this.loginMode">Se connecter</div>
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
