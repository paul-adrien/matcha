import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { messagingService } from "../_service/messaging_service";
import { PossConv, ActiveConv, Messages } from "../../../libs/messaging";

@Component({
  selector: "app-home-messaging",
  template: `
    <div>
      <div *ngFor="let User of possiblyConv">
        <div>
          <p>{{ User.firstName }}</p>
          <p>{{ User.lastName }}</p>
          <p>{{ User.email }}</p>
          <p>{{ User.userName }}</p>
          <p>{{ User.birthDate }}</p>
        </div>
      </div>
      <button (click)="getMessages()">get messages</button>
      <button (click)="sendMessage()">send messages</button>
      <div *ngFor="let msg of messages">
        <div>
          <p>{{ msg.msg }}</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./home-messaging.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMessagingComponent implements OnInit {
  possiblyConv: PossConv[];
  activeConv: ActiveConv[];
  messages: Messages[];

  constructor(private messagingService: messagingService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.messagingService.possiblyConv(JSON.parse(localStorage.getItem("id"))).subscribe(
      data => {
        console.log(data);
        this.possiblyConv = data;
      },
      err => {
        console.log(err);
      }
    );

    this.messagingService.activeConv(JSON.parse(localStorage.getItem("id"))).subscribe(
      data => {
        console.log(data);
        this.activeConv = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  getMessages() {
    this.messagingService.getMessage("2").subscribe(
      data => {
        console.log(data);
        this.messages = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  sendMessage() {
    this.messagingService.sendMessage("2", "test3", "1").subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      }
    );
  }
}
