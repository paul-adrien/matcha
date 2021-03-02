import { userService } from "./../_service/user_service";
import { User } from "./../../../libs/user";
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
  AfterContentInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { messagingService } from "../_service/messaging_service";
import { Messages, MessageSend } from "../../../libs/messaging";
import { Observable, interval } from "rxjs";
import { element } from "protractor";
import { Location } from "@angular/common";

@Component({
  selector: "app-discussion",
  template: `
    <div class="header-container">
      <img class="back" src="./assets/chevron-left.svg" (click)="this.back()" />
      <div
        class="user-container"
        *ngIf="this.otherUser$ | async as otherUser"
        (click)="this.viewProfil()"
      >
        <img class="picture" [src]="otherUser.pictures[0].url" />
        <span class="text">{{ otherUser.userName }}</span>
      </div>
    </div>
    <div #scroll *ngIf="this.messages; else noMessages" class="messages-container">
      <div
        *ngFor="let message of this.messages"
        class="messages-content"
        [class.left-message]="message.sender_id !== this.userId.toString()"
      >
        <span
          class="message-bulb"
          [class.left-message]="message.sender_id !== this.userId.toString()"
          >{{ message.msg }}</span
        >
      </div>
    </div>
    <ng-template #noMessages>
      <div class="no-messages"></div>
    </ng-template>
    <!-- <div *ngIf="newMsgs">
        <div  *ngFor="let Msg of newMsgs">
          <p>{{ Msg.msg }}</p>
          <p>{{ Msg.sendingDate }}</p>
        </div>
      </div> -->
    <form
      class="input-container"
      name="form"
      (ngSubmit)="f.form.valid && sendMessage()"
      #f="ngForm"
      novalidate
    >
      <input
        autocomplete="off"
        type="text"
        [(ngModel)]="form.msg"
        name="msg"
        required
        #msg="ngModel"
        placeholder="message"
        class="input-message"
      />
      <img class="send" src="./assets/send.svg" (click)="f.form.valid && sendMessage()" />
    </form>
  `,
  styleUrls: ["./discussion.component.scss"],
})
export class DiscussionComponent implements OnInit, OnDestroy {
  @ViewChild("scroll", { static: false }) scroll: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public messagingService: messagingService,
    private userService: userService,
    private location: Location,
    private cd: ChangeDetectorRef
  ) {}

  public userId: string = "";
  public otherUser$: Observable<User>;

  public otherUserId: string = this.route.snapshot.params.id;
  public convId: string = this.route.snapshot.params.convId;
  form: MessageSend = {
    msg: "",
  };
  public messages: Messages[];
  public interval: any;

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem("id"));
    this.otherUser$ = this.userService.getUser(this.otherUserId);
    this.getMessage();
    this.interval = setInterval(x => {
      this.getMessage();
      this.messagingService
        .seeMsgNotif(this.otherUserId, JSON.parse(localStorage.getItem("id")))
        .subscribe(
          data => {},
          err => {}
        );
    }, 5000);
    if (this.scroll) {
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
      this.cd.detectChanges();
    }
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getMessage() {
    this.messagingService.getMessage(this.convId).subscribe(
      data => {
        let tmp = this.messages;
        this.messages = data["messages"];
        this.cd.detectChanges();
        if (JSON.stringify(tmp) !== JSON.stringify(this.messages) && this.scroll) {
          this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
          this.cd.detectChanges();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  sendMessage() {
    this.messagingService
      .sendMessage(this.convId, this.form.msg, this.userId, this.otherUserId)
      .subscribe(
        data => {
          this.getMessage();
        },
        err => {
          console.log(err);
        }
      );
  }

  viewProfil() {
    this.router.navigate(["home/profile-view/" + this.otherUserId]);
  }

  public back() {
    this.location.back();
  }
}
