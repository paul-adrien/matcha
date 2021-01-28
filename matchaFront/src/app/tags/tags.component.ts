import { Component, OnInit } from '@angular/core';
import { userService } from '../_service/user_service';
import { Tags } from '../../../libs/user';

@Component({
  selector: 'app-tags',
  template: `
  <div>
    <label for="repeatSelect1">Ajouter un tag parmis ceux existant:</label>
    <form class="form-container" name="form" (ngSubmit)="f.form.valid && addExistTag()" #f="ngForm" novalidate >
      <select class="form-control"
          name="id"
          [(ngModel)]="form.id"
          required
          #id="ngModel">
        <option *ngFor="let tag of tags" value="{{tag.id}}">{{tag.name}}</option>
      </select>
      <button type="submit">Ajouté</button>
    </form>
  </div>
  <div>
    <form class="form-container" name="form" (ngSubmit)="addNewTag()" #f="ngForm" novalidate>
      <label for="ajout">Ajouter un nouveau tag</label>
      <input name="tag" [(ngModel)]="form.name" type='text' pattern='#[a-zA-ZÀ-ÿ0-9]' placeholder="#..." required/>
      <button type="submit">Ajouté</button>
    </form>
  </div>
  <div>
    <strong>Vos tags</strong>
    <p><span *ngFor="let yTag of YourTags">{{yTag.name}} </span></p>
  </div>
  `,
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  tags = [];
  YourTags = [];

  public form: Partial<Tags> = {};

  constructor(private userService: userService) { }

  ngOnInit(): void {
    this.userService.getAllTags().subscribe(
      data => {
        console.log(data);
        if (data.status === true) {
          this.tags = data.tags;
        }
      },
      err => {
      }
    );

    this.userService.getYourTags(JSON.parse(localStorage.getItem('id'))).subscribe(
      data => {
        console.log(data);
        if (data.status === true) {
          this.YourTags = data.tags;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  addExistTag() {
    this.userService.addExistTag(JSON.parse(localStorage.getItem('id')), this.form.id).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      }
    );
    this.userService.getYourTags(JSON.parse(localStorage.getItem('id'))).subscribe(
      data => {
        console.log(data);
        if (data.status === true) {
          this.YourTags = data.tags;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  addNewTag() {
    this.userService.addNonExistTag(this.form.name, JSON.parse(localStorage.getItem('id'))).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      }
    );
    this.userService.getYourTags(JSON.parse(localStorage.getItem('id'))).subscribe(
      data => {
        console.log(data);
        if (data.status === true) {
          this.YourTags = data.tags;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
