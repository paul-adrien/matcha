import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/auth_service';

@Component({
  selector: 'app-maintenance',
  template: `
  <p> le site est en maintenance </p>
  `,
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    localStorage.clear();
  }

}
