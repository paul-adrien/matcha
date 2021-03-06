import { profilService } from "./../_service/profil_service";
import { History, Notif } from "./../../../libs/user";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { messagingService } from "../_service/messaging_service";
import { PossConv, ActiveConv, Messages } from "../../../libs/messaging";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { userService } from "../_service/user_service";

@Component({
  selector: "app-home-messaging",
  template: `
    <div class="container">
      <span class="title">Historique</span>
      <div class="scroll">
        <div
          *ngIf="(this.usersHistory$ | async)?.length > 0; else noMatch"
          class="poss-conv-container"
        >
          <app-profil-card
            *ngFor="let userHistory of this.usersHistory$ | async"
            [user]="userHistory.user"
            [type]="userHistory.type"
          ></app-profil-card>
        </div>
        <ng-template #noMatch>
          <div class="no-data">Vous n'avez aucun match.</div>
        </ng-template>
      </div>
      <span class="title">Match</span>
      <div class="scroll">
        <div
          *ngIf="(this.possiblyConv$ | async)?.length > 0; else noMatch"
          class="poss-conv-container"
        >
          <app-profil-card
            *ngFor="let possConv of this.possiblyConv$ | async"
            [user]="possConv.user"
            [messaging]="true"
            (click)="discussion(possConv.user.id, possConv.convId)"
          ></app-profil-card>
        </div>
        <ng-template #noMatch>
          <div class="no-data">Vous n'avez aucun match.</div>
        </ng-template>
      </div>
      <span class="title">Discussions</span>
      <div
        *ngIf="(activeConv$ | async)?.length > 0; else noDiscussion"
        class="active-conv-container"
      >
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
      <ng-template #noDiscussion>
        <div class="no-data">Vous n'avez aucune discussion.</div>
      </ng-template>
    </div>
  `,
  styleUrls: ["./home-messaging.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMessagingComponent implements OnInit {
  public possiblyConv$: Observable<PossConv[]>;
  public activeConv$: Observable<ActiveConv[]>;
  public usersHistory$: Observable<History[]>;

  constructor(
    private messagingService: messagingService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private profilService: profilService
  ) {
    this.possiblyConv$ = this.messagingService.possiblyConv(JSON.parse(localStorage.getItem("id")));
    this.activeConv$ = this.messagingService.activeConv(JSON.parse(localStorage.getItem("id")));
    this.usersHistory$ = this.profilService.getHistory(JSON.parse(localStorage.getItem("id")));
  }

  ngOnInit(): void {}

  discussion(id, convId) {
    this.router.navigate(["home/discussion/" + id + "/" + convId]);
  }

  viewProfil(id: string) {
    this.router.navigate(["home/profile-view/" + id]);
  }
}
