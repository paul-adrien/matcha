import { Component, OnInit } from '@angular/core';
import { messagingService } from '../_service/messaging_service';

@Component({
  selector: 'app-home-messaging',
  template: `
    <div>
      <tr *ngFor="let User of possiblyConv">
          <div>
            <p>{{ User.firstName }}</p>
            <p>{{ User.lastName }}</p>
            <p>{{ User.email }}</p>
            <p>{{ User.userName }}</p>
            <p>{{ User.birthDate }}</p>
          </div>
      </tr>
    </div>
  `,
  styleUrls: ['./home-messaging.component.scss']
})
export class HomeMessagingComponent implements OnInit {
  possiblyConv = [];

  constructor(private messagingService: messagingService) { }

  ngOnInit(): void {
    this.messagingService
    .possiblyConv(JSON.parse(localStorage.getItem("id")))
    .subscribe(
      data => {
        console.log(data);
        this.possiblyConv = data.users;
      },
      err => {
        console.log(err);
      }
    );
  }

}
