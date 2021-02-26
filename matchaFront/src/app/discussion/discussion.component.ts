import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { messagingService } from '../_service/messaging_service';
import { Messages, MessageSend } from '../../../libs/messaging';
import { Observable, interval } from 'rxjs';
import { element } from 'protractor';

@Component({
  selector: 'app-discussion',
  template: `
    <div>
      <p>{{userId}}</p>
      <p>{{convId}}</p>
    </div>
    <div class="messages">
      <div *ngIf="messages$">
        <div  *ngFor="let Msg of messages$">
          <p>{{ Msg.msg }}</p>
          <p>{{ Msg.sendingDate }}</p>
        </div>
      </div>
      <!-- <div *ngIf="newMsgs">
        <div  *ngFor="let Msg of newMsgs">
          <p>{{ Msg.msg }}</p>
          <p>{{ Msg.sendingDate }}</p>
        </div>
      </div> -->
    </div>
    <form
        class="form-container"
        name="form"
        (ngSubmit)="f.form.valid && sendMessage()"
        #f="ngForm"
        novalidate>
          <span class="info-top">Nouveau message</span>
          <input
            type="text"
            [(ngModel)]="form.msg"
            name="msg"
            required
            #msg="ngModel"
            placeholder="message"
          />
        <button class="primary-button">
          Envoyer
        </button>
      </form>
  `,
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private router: Router, public messagingService: messagingService,
    private cd: ChangeDetectorRef) {
  }

  public userId: string = this.route.snapshot.params.id;
  public convId: string = this.route.snapshot.params.convId;
  form: MessageSend = {
    msg: ""
  };
  public messages$: Messages[];
  public interval: any;

  ngOnInit(): void {
    this.getMessage();
    this.interval = setInterval(x => {this.getMessage(); this.messagingService.seeMsgNotif(this.userId, JSON.parse(localStorage.getItem("id"))).subscribe(data=>{},err=>{})}, 5000);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getMessage() {
    this.messagingService.getMessage(this.convId).subscribe(
      data => {
        this.messages$ = data["messages"];
        this.cd.detectChanges();
      },
      err => {
        console.log(err);
      }
    );
  }

  sendMessage() {
    this.messagingService.sendMessage(this.convId, this.form.msg, JSON.parse(localStorage.getItem("id")), this.userId).subscribe(
      data => {
        this.getMessage();
      },
      err => {
        console.log(err);
      }
    );
  }
}
