import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maintenance',
  template: `
  <p> le site est en maintenance </p>
  `,
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
