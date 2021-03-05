import { User } from "@matcha/shared";
import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { differenceInYears } from "date-fns";

@Component({
  selector: "app-profil-card",
  template: `
    <div class="big-profile-picture" (click)="viewProfil()">
      <img
        class="picture"
        [src]="
          this.user?.pictures[0]?.url && this.user?.pictures[0]?.url !== null
            ? this.user?.pictures[0].url
            : './assets/user.svg'
        "
      />
      <img
        class="type"
        *ngIf="this.type"
        [src]="this.type === 'like' ? './assets/star-no-fill.svg' : './assets/eye.svg'"
      />
    </div>
    <div class="content-name">
      <span>{{ this.user?.userName }} {{ this.getAge(this.user?.birthDate) }} ans</span>
      <span>{{ this.user?.firstName }} {{ this.user?.lastName }}</span>
    </div>
  `,
  styleUrls: ["./profil-card.component.scss"],
})
export class ProfilCardComponent implements OnInit {
  @Input() user: User;
  @Input() type = "";
  @Input() messaging = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  viewProfil() {
    if (!this.messaging) {
      this.router.navigate(["home/profile-view/" + this.user.id]);
    }
  }

  public getAge(birthDate: Date) {
    return differenceInYears(new Date(), new Date(birthDate));
  }
}
