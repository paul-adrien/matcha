import { Component, OnInit, ElementRef } from "@angular/core";
import { Notif } from "../../../libs/user";
import { userService } from "../_service/user_service";
import { interval } from "rxjs";

@Component({
  selector: "app-notification",
  template: `
    <div class="mmodal">
      <div class="mmodal-body">
        <ng-content></ng-content>
      </div>
    </div>
    <div class="mmodal-background" (click)="this.close()"></div>
  `,
  styleUrls: ["./notification.component.scss"],
})
export class NotificationComponent implements OnInit {
  constructor(private userService: userService, private el: ElementRef) {}

  ngOnInit(): void {}

  close() {
    this.el.nativeElement.classList.remove("sshow");
    this.el.nativeElement.classList.add("hhidden");
  }
}
