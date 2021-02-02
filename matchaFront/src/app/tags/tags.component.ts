import { Tags } from './../../../libs/user';
import { AfterContentChecked, AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { userService } from '../_service/user_service';
import { Subject, Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-tags',
  template: `
  <span class="info-top">Vos interêts</span>
  <form *ngIf="(this.tags$ | async) && (this.yourTags$ | async)" class="form-container" name="form" #f="ngForm" novalidate >
      <select
          name="id"
          [(ngModel)]="form.id"
          required
          #id="ngModel" [value]="'default'"
          (change)="this.addExistTag()">
        <option value="default">Choisir un tag</option>
        <option *ngFor="let tag of this.tags$ | async" [value]="tag.id" [disabled]="this.disabledTags(tag, this.yourTags$ | async)" >{{tag.name}}</option>
      </select>
      <span class="or">OU</span>
      <input name="tag" [(ngModel)]="form.name" type='text' pattern='#[a-zA-ZÀ-ÿ0-9]' placeholder="#..." (keyup.enter)="this.addNewTag()"/>
    </form>
  <div class="tag-container">
    <div class="tag" *ngFor="let yTag of this.yourTags$ | async">
    <span>{{yTag.name}}</span>
    <img src="./assets/x.svg" (click)="this.deleteTag(yTag)"></div>
  </div>
  `,
  styleUrls: ['./tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent implements  OnDestroy {

  private unsubscribe = new Subject<void>();

  public yourTags$: Observable<Tags[]>;
  public tags$: Observable<Tags[]>;
  public form: Partial<Tags> = {id: 'default'};


  constructor(private userService: userService, private cd: ChangeDetectorRef) {
  }


  ngOnInit() {
    this.yourTags$ = this.userService.getYourTags(JSON.parse(localStorage.getItem('id')));
    this.tags$ = this.userService.getAllTags();
  }

  addExistTag() {
    this.userService.addExistTag(JSON.parse(localStorage.getItem('id')), this.form.id).subscribe(
      data => {
        console.log(data);
        this.ngOnInit()
        this.cd.detectChanges();
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
        this.ngOnInit()
        this.cd.detectChanges();
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteTag(tag: Tags) {
    this.userService.deleteTag(JSON.parse(localStorage.getItem('id')), tag.id).subscribe(
      data => {
        console.log(data);
        this.ngOnInit()
        this.cd.detectChanges();
      },
      err => {
        console.log(err);
      }
    );
  }

  disabledTags(tag: Tags, yourTags: Tags[]) {
    let res = false;
    res = yourTags && !!yourTags.find(el => el.id.toString() === tag.id.toString())
    return res;
  }


  ngOnDestroy() {
   this.unsubscribe.next();
   this.unsubscribe.complete();
  }
}
