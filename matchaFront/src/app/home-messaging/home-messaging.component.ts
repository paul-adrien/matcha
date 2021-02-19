import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { messagingService } from "../_service/messaging_service";
import { PossConv, ActiveConv, Messages } from "../../../libs/messaging";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: "app-home-messaging",
  template: `
    <div>
      <div *ngIf="possiblyConv$ | async">
        <div  *ngFor="let User of possiblyConv$ | async">
          <p>{{ User.firstName }}</p>
          <p>{{ User.lastName }}</p>
          <p>{{ User.email }}</p>
          <p>{{ User.userName }}</p>
          <p>{{ User.birthDate }}</p>
        </div>
      </div>
      <br><br>
      <div *ngIf="activeConv$ | async">
        <div  *ngFor="let Conv of activeConv$ | async" (click)="discussion(Conv.other_id, Conv.id)">
          <p>{{ Conv.other_id }}</p>
          <p>{{ Conv.lastMsg }}</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./home-messaging.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMessagingComponent implements OnInit {
  possiblyConv$: Observable<PossConv[]> = this.messagingService.possiblyConv(JSON.parse(localStorage.getItem("id")));
  activeConv$: Observable<ActiveConv[]> = this.messagingService.activeConv(JSON.parse(localStorage.getItem("id")));

  constructor(private messagingService: messagingService, private cd: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
  }

  discussion(id, convId) {
    this.router.navigate(["home/discussion/" + id + "/" + convId]);
  }
}
