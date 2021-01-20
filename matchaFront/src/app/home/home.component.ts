import { Component, OnInit } from '@angular/core';
import { User } from '@matcha/shared';

@Component({
  selector: 'home',
  template: `
    <nav-bar></nav-bar>
    <div class="page">
      <profile [user]="this.user"></profile>
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  public user: User;

  ngOnInit(): void {
    const tmp = JSON.parse(localStorage.getItem('user'));
    this.user = {
      userName: tmp.userName,
      firstName: tmp.prenom,
      lastName: tmp.name,
      birthate: tmp.date_naissance,
      password: tmp.password,
      email: tmp.email,
      id: tmp.id,
      genre: tmp.genre,
      ori_sex: tmp.ori_sex,
      bio: tmp.bio,
      score: tmp.score,
      city: tmp.city,
      latitude: tmp.latitude,
      longitude: tmp.longitude,
      acc_valid: tmp.acc_valid,
      acc_comp: tmp.acc_comp,
      link: tmp.link,
    }
    console.log(this.user);
  }

}
