import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profil-card',
  template: `
    <p>firstname: {{firstName}}</p>
    <p>lastName: {{lastName}}</p>
    <p>birthday: {{birthday}}</p>
  `,
  styleUrls: ['./profil-card.component.scss']
})
export class ProfilCardComponent implements OnInit {

  @Input() firstName: string;
  @Input() lastName: string;
  @Input() birthday: string;
  @Input() index: number;
  @Input() id: number;

  constructor() { }

  ngOnInit(): void {
  }

}
