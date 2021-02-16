import { Component, OnInit } from '@angular/core';
import { Notif } from '../../../libs/user';
import { userService } from '../_service/user_service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-notification',
  template: `
  <div>
    <div *ngFor="let notif of notifs">
      <p>{{notif.otherId}}</p>
      <p>{{notif.type}}</p>
      <p>{{notif.date}}</p>
      <p>{{notif.see}}</p>
    </div>
  </div>
  `,
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifs: Notif[];

    constructor(private userService: userService) {
      interval(10000)
      .subscribe(x => this.userService.getNotifs(JSON.parse(localStorage.getItem("id")))
      .subscribe(
        data => {
          console.log(data);
          this.notifs = data;
        },
        err => {
          console.log(err);
        }
      ))
    }

  ngOnInit(): void {
    this.userService.getNotifs(JSON.parse(localStorage.getItem("id"))).subscribe(
      data => {
        console.log(data);
        this.notifs = data;
      },
      err => {
        console.log(err);
      }
    );
  }

}
