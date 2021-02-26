import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { messagingService } from "../_service/messaging_service";
import { PossConv, ActiveConv, Messages } from "../../../libs/messaging";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { userService } from "../_service/user_service";

@Component({
  selector: "app-home-messaging",
  template: `
    <div *ngIf="(this.possiblyConv$ | async)?.length > 0" class="possConv">
      <app-profil-card
        *ngFor="let possConv of this.possiblyConv$ | async"
        [user]="possConv.user"
        [messaging]="true"
      ></app-profil-card>
    </div>
    <div *ngIf="(activeConv$ | async)?.length > 0" class="active-conv-container">
      <div
        *ngFor="let conv of this.activeConv$ | async"
        (click)="discussion(conv.otherUser.id, conv.id)"
        class="active-conv-content"
      >
        <img
          class="picture"
          [src]="
            conv.otherUser?.pictures[0]?.url && conv.otherUser?.pictures[0]?.url !== null
              ? conv.otherUser?.pictures[0].url
              : './assets/user.svg'
          "
        />
        <div class="text">
          <span class="username">{{ conv.otherUser.userName }}</span>
          <span>{{ conv.lastMsg }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./home-messaging.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMessagingComponent implements OnInit {
  public possiblyConv$: Observable<PossConv[]>;
  public activeConv$: Observable<ActiveConv[]>;

  constructor(
    private messagingService: messagingService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private userService: userService
  ) {
    this.possiblyConv$ = this.messagingService.possiblyConv(JSON.parse(localStorage.getItem("id")));
    this.activeConv$ = this.messagingService.activeConv(JSON.parse(localStorage.getItem("id")));
  }

  ngOnInit(): void {}

  discussion(id, convId) {
    this.router.navigate(["home/discussion/" + id + "/" + convId]);
  }
}
