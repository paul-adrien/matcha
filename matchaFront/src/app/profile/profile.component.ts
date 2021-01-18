import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'profile',
  template: `
  <div class="profile-picture">
    <img [src]="this.url ? this.url :  './assets/user.svg'">
  </div>
  <input class="input-file" accept="image/*" type='file' (change)="onSelectFile($event)">
  `,
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

 public url = '';

  public onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result as string;
      }
    }
  }

  public delete(){
    this.url = null;
  }

}
