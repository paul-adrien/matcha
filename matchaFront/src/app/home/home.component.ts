import { Component, OnInit } from '@angular/core';
import { User } from '@matcha/shared';

@Component({
  selector: 'home',
  template: `
    <nav-bar></nav-bar>
    <div class="page">
      <router-outlet [routerLink]="this.user"></router-outlet>
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
      birthDate: tmp.birthDate,
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
      link: tmp.link,
      pictures: [
        {id: "picture1", url: tmp.picture1 as string},
        {id: "picture2", url: tmp.picture2 as string},
        {id: "picture3", url: tmp.picture3 as string},
        {id: "picture4", url: tmp.picture4 as string},
        {id: "picture5", url: tmp.picture5 as string},
        {id: "picture6", url: tmp.picture6 as string},
      ]
    };
    console.log(this.user, this.token);
  }

}
