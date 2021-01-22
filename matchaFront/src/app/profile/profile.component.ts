import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '@matcha/shared';
import { profilService } from '../_service/profil_service';

@Component({
  selector: 'profile',
  template: `
  <div class="profile-picture">
    <img [src]="this.url ? this.url :  './assets/user.svg'">
  </div>
  <input class="input-file" accept="image/*" type='file' (change)="onSelectFile($event)">
  <form class="form-container" name="form" (ngSubmit)="f.form.valid && onSubmit()" #f="ngForm" novalidate>
    <div class="info-container">
      <span class="info-top">Nom d'utilisateur</span>
      <input *ngIf="this.updateMode" type="text"
          name="userName"
          [(ngModel)]="form.userName"
          required
          minlength="3"
          maxlength="20"
          #userName="ngModel" placeholder="Nom d'utilisateur"/>
      <p *ngIf="!this.updateMode">{{form.userName}}</p>
    </div>
    <div class="info-container">
      <span class="info-top">Nom</span>
      <input *ngIf="this.updateMode" type="text"
          name="lastName"
          [(ngModel)]="form.lastName"
          required
          minlength="3"
          maxlength="20"
          #lastName="ngModel" placeholder="Nom"/>
      <p *ngIf="!this.updateMode">{{form.lastName}}</p>
    </div>
    <div class="info-container">
      <span class="info-top">Prénom</span>
      <input *ngIf="this.updateMode" type="text"
          name="FirstName"
          [(ngModel)]="form.firstName"
          required
          minlength="3"
          maxlength="20"
          #firstName="ngModel" placeholder="Prénom"/>
      <p *ngIf="!this.updateMode">{{form.firstName}}</p>
    </div>
    <div class="info-container">
      <span class="info-top">Email</span>
      <input *ngIf="this.updateMode" type="text"
          name="email"
          [(ngModel)]="form.email"
          required
          email
          #email="ngModel" placeholder="Email"/>
      <p *ngIf="!this.updateMode">{{form.email}}</p>
    </div>
    <div class="info-container">
      <span class="info-top">Bio</span>
      <textarea *ngIf="this.updateMode" type="text"
          class="form-control"
          name="bio"
          [(ngModel)]="form.bio"
          #bio="ngModel" placeholder="bio"></textarea>
      <p *ngIf="!this.updateMode">{{form.bio}}</p>
    </div>
    <div class="info-container">
      <span class="info-top">Genre</span>
      <select [(ngModel)]="form.gender" *ngIf="this.updateMode" name="Genre">
        <option id="Homme" name="Homme" value="0">Homme</option>
        <option id="Femme" name="Femme" value="1">Femme</option>
        <option id="Kamoulox" name="Kamoulox" value="2">Kamoulox</option>
      </select>
      <p *ngIf="!this.updateMode">{{form.gender}}</p>
    </div>
        <button (ngSubmit)="onSubmit()" *ngIf="this.updateMode" class="primary-button">enregistrer</button>
  </form>
  <button (click)="changeUpdateMode(true)" *ngIf="!this.updateMode" class="primary-button">modifier le profil</button>
        <a routerLink="/forgotPass" routerLinkActive="active">Mot de passe oublié ?</a>
  `,
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() user: User;

  public form: Partial<User> = {};
  public url = '';
  public updateMode = false;
  public saveEmail = '';

  constructor(private profilService: profilService, private route: Router ) { }

  ngOnInit() {
    this.form = this.user;
    this.saveEmail = this.user.email;
  }

  public changeUpdateMode(updateMode) {
    this.updateMode = updateMode;
  }

  public onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result as string;
      }
    }
  }

  public onSubmit() {
    this.profilService.update(this.form, this.saveEmail).subscribe(
      data => {
        console.log(data);
        if (data.status == true) {
          localStorage.removeItem('user');
          localStorage.setItem("user", JSON.stringify(data.user));
          this.route.navigate(["home"]);
          window.location.reload();
        }
      },
      err => {
      }
    );
  }

  public delete(){
    this.url = null;
  }

}
