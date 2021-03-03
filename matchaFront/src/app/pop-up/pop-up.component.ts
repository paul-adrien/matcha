import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-pop-up",
  template: `
    <span>{{ this.data?.title }}</span>
    <span>{{ this.data?.message }}</span>
    <div class="primary-button">J'ai compris</div>
  `,
  styleUrls: ["./pop-up.component.scss"],
})
export class PopUpComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
