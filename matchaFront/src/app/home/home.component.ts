import { Component, OnInit } from '@angular/core';
import { User } from '@matcha/shared';

@Component({
  selector: 'home',
  template: `
    <nav-bar></nav-bar>
    <div class="page">
      <discover [user]="this.user"></discover>
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  public user: User;
  public token: string;

  ngOnInit(): void {
    const tmp = JSON.parse(localStorage.getItem('user'));
    const token = JSON.parse(localStorage.getItem('token'));
    this.token = token;
    this.user = {
      userName: tmp.userName,
      firstName: tmp.firstName,
      lastName: tmp.lastName,
      birthate: tmp.birthDate,
      password: tmp.password,
      email: tmp.email,
      id: tmp.id,
      gender: tmp.gender,
      showMe: tmp.showMe,
      bio: tmp.bio,
      score: tmp.score,
      city: tmp.city,
      latitude: tmp.latitude,
      longitude: tmp.longitude,
      emailVerify: tmp.emailVerify,
      profileComplete: tmp.profileComplete,
      link: tmp.link
    };
    console.log(this.user, this.token);
  }

}