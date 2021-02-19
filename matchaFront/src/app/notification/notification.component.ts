import { Component, OnInit, ElementRef } from '@angular/core';
import { Notif } from '../../../libs/user';
import { userService } from '../_service/user_service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-notification',
  template: `
  <div class="mmodal">
    <div class="mmodal-body">
      <ng-content></ng-content>
    </div>
  </div>
  <div class="mmodal-background"></div>
  `,
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifs: Notif[];

    constructor(private userService: userService, private el: ElementRef) {
    }

  ngOnInit(): void {
    // we added this so that when the backdrop is clicked the modal is closed.
    this.el.nativeElement.addEventListener('click', ()=> {
        this.close()
    })
  }

  close() {
      this.el.nativeElement.classList.remove('sshow')
      this.el.nativeElement.classList.add('hhidden')
  }

}
