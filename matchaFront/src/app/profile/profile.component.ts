import { Component, Input, OnInit } from '@angular/core';
import { User } from '@matcha/shared';

@Component({
  selector: 'profile',
  template: `
  <div class="profile-picture">
    <img [src]="this.url ? this.url :  './assets/user.svg'">
  </div>
  <input class="input-file" accept="image/*" type='file' (change)="onSelectFile($event)">
  <form class="form-container" name="form" (ngSubmit)="f.form.valid" #f="ngForm" novalidate>
    <div class="info-container">
      <span class="info-top">Prénom</span>
      <input type="text"
          name="FirstName"
          [(ngModel)]="form.firstName"
          required
          minlength="3"
          maxlength="20"
          #prenom="ngModel" placeholder="Prénom"/>
    </div>
    <div class="info-container">
      <span class="info-top">Bio</span>
      <textarea type="text"
          class="form-control"
          name="bio"
          [(ngModel)]="form.bio"
          minlength="3"
          #prenom="ngModel" placeholder="bio"></textarea>
    </div>
    <div class="info-container">
      <span class="info-top">Genre</span>
      <select name="Genre">
        <option>Homme</option>
        <option>Femme</option>
        <option>Kamoulox</option>
      </select>
    </div>
  </form>
  `,
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() user: User;

  public form: Partial<User> = {};
  public url = '';

  constructor() { }

  ngOnInit() {
    this.form = this.user
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

  public delete(){
    this.url = null;
  }

}
