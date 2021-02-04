import { Component, OnInit } from '@angular/core';
import { matchService } from '../_service/match_service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggestion',
  template: `
  <div class="content">
  <tr *ngFor="let User of usersMatch">
    <p>{{User.firstName}}</p>
    <p>{{User.lastName}}</p>
    <p>{{User.email}}</p>
    <p>{{User.userName}}</p>
    <p>{{User.birthDate}}</p>
    <a (click)="viewProfil(User.id)"><button>Voir le profil complet</button></a>
</tr>
</div>
  `,
  styleUrls: ['./suggestion.component.scss']
})
export class SuggestionComponent implements OnInit {

  constructor(private matchService: matchService, private router: Router) { }

  usersMatch = [];

  ngOnInit(): void {
    this.matchService.getSuggestion(JSON.parse(localStorage.getItem('id')), 0, 120, 0, 1000, 1).subscribe(
      data => {
        console.log(data);
        this.usersMatch = data.userMatch;
      },
      err => {
        console.log(err);
      }
    );
  }

  viewProfil(id) {
    console.log(id);
    this.router.navigate(["home/profil-match/" + id]);
  }

}
