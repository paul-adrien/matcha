import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home',
  template: `
    <nav-bar></nav-bar>
    <div class="page">
      <profile></profile>
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
