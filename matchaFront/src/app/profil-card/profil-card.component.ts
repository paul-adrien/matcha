import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil-card',
  template: `
    <p>email: {{email}}</p>
    <p>firstname: {{firstName}}</p>
    <p>lastName: {{lastName}}</p>
    <p>birthday: {{birthday}}</p>
    <a (click)="viewProfil()"><button>Voir le profil complet</button></a>
  `,
  styleUrls: ['./profil-card.component.scss']
})
export class ProfilCardComponent implements OnInit {

  @Input() firstName: string;
  @Input() email: string;
  @Input() lastName: string;
  @Input() birthday: string;
  @Input() index: number;
  @Input() id: number;

  constructor(private router: Router, ) { }

  ngOnInit(): void {
  }

  viewProfil() {
    this.router.navigate(["home/profil-match/" + this.id]);
  }

}
