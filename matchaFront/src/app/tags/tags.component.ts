import { Tags } from "./../../../libs/user";
import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { userService } from "../_service/user_service";
import { Subject, Observable, timer, combineLatest } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { Router } from '@angular/router';

@Component({
  selector: "app-tags",
  template: `
    <span class="info-top">Vos interêts</span>
    <form
      *ngIf="this.allTags && this.yourTags && !this.showMode"
      class="form-container"
      name="form"
      #f="ngForm"
      novalidate
    >
      <select
        name="id"
        [(ngModel)]="form.id"
        required
        #id="ngModel"
        [value]="'default'"
        (change)="this.addExistTag()"
      >
        <option value="default">Choisir un tag</option>
        <option
          *ngFor="let tag of this.allTags"
          [value]="tag.id"
          [disabled]="this.disabledTags(tag, this.yourTags)"
        >
          {{ tag.name }}
        </option>
      </select>
      <span class="or">OU</span>
      <input
        name="tag"
        [(ngModel)]="form.name"
        type="text"
        pattern="#[a-zA-ZÀ-ÿ0-9]"
        placeholder="#..."
        (keyup.enter)="this.addNewTag()"
      />
    </form>
    <div *ngIf="this.yourTags" class="tag-container">
      <div class="tag" *ngFor="let yTag of this.yourTags">
        <span>{{ yTag.name }}</span>
        <img
          *ngIf="!this.showMode && this.yourTags.length > 1"
          src="./assets/x.svg"
          (click)="this.deleteTag(yTag)"
        />
      </div>
    </div>
  `,
  styleUrls: ["./tags.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent implements OnDestroy {
  @Input() public showMode = false;
  @Output() public addExist = new EventEmitter<string>();
  @Output() public addNew = new EventEmitter<string>();
  @Output() public delete = new EventEmitter<string>();

  private unsubscribe = new Subject<void>();

  constructor(private userService: userService, private cd: ChangeDetectorRef, private route: Router) {}

  public form: Partial<Tags> = { id: "default" };

  public yourTags: Tags[] = [];

  public allTags: Tags[] = [];

  public yourTags$: Tags[] = [];

  public allTags$: Tags[] = [];

  ngOnInit(): void {
    console.log("wes");
    combineLatest([
      this.userService.getAllTags(),
      this.userService.getYourTags(JSON.parse(localStorage.getItem("id"))),
    ]).subscribe(([allTags, yourTags]) => {
      if (Array.isArray(allTags) && Array.isArray(yourTags)) {
        this.allTags = allTags;
        this.yourTags = yourTags;
      }
      this.cd.detectChanges();
    },
    err => {
      this.route.navigate(["/maintenance"]);
    });
  }

  addExistTag() {
    this.addExist.emit(this.form.id);
    this.cd.detectChanges();
    this.ngOnInit();
  }

  addNewTag() {
    this.addNew.emit(this.form.name);
    this.cd.detectChanges();
    this.ngOnInit();
  }

  deleteTag(tag: Tags) {
    this.delete.emit(tag.id);
    this.cd.detectChanges();
    this.ngOnInit();
  }

  disabledTags(tag: Tags, yourTags: Tags[]) {
    let res = false;
    res =
      yourTags &&
      yourTags.length > 0 &&
      !!yourTags.find(el => el.id.toString() === tag.id.toString());
    return res;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
