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
} from "@angular/core";
import { userService } from "../_service/user_service";
import { Subject, Observable } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";

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
    <div *ngIf="this.yourTags?.length > 0" class="tag-container">
      <div class="tag" *ngFor="let yTag of this.yourTags">
        <span>{{ yTag.name }}</span>
        <img *ngIf="!this.showMode" src="./assets/x.svg" (click)="this.deleteTag(yTag)" />
      </div>
    </div>
  `,
  styleUrls: ["./tags.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent implements OnDestroy {
  @Input() public showMode = false;
  @Input() public allTags: Tags[];
  @Input() public yourTags: Tags[];
  @Output() public addExist = new EventEmitter<string>();
  @Output() public addNew = new EventEmitter<string>();
  @Output() public delete = new EventEmitter<string>();

  private unsubscribe = new Subject<void>();

  constructor(private userService: userService, private cd: ChangeDetectorRef) {}

  public form: Partial<Tags> = { id: "default" };

  addExistTag() {
    this.addExist.emit(this.form.id);
    this.cd.detectChanges();
  }

  addNewTag() {
    this.addNew.emit(this.form.name);
    this.cd.detectChanges();
  }

  deleteTag(tag: Tags) {
    this.delete.emit(tag.id);
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
