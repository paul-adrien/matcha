import { Filtre, User } from "../../../libs/user";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import { matchService } from "../_service/match_service";
import { Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { Options } from "@angular-slider/ngx-slider";
import { Observable } from "rxjs";

@Component({
  selector: "app-filter-and-sort",
  template: `
    <form
      class="form-container"
      [formGroup]="this.sliderForm"
      (ngSubmit)="f.form.valid && filtreUsersBy()"
      #f="ngForm"
      name="form"
      novalidate
    >
      <div class="custom-slider sort">
        <span>Trier par:</span>
        <select class="select" formControlName="sortBy">
          <option *ngFor="let option of this.sortOptions" [ngValue]="option.id">
            {{ option.name }}
          </option>
        </select>
      </div>
      <div class="custom-slider">
        <span>Age</span>
        <ngx-slider [options]="ageOptions" formControlName="age"></ngx-slider>
      </div>
      <div class="custom-slider">
        <span>Score minimum</span>
        <ngx-slider [options]="scoreOptions" formControlName="score"></ngx-slider>
      </div>
      <div class="custom-slider">
        <span>Distance max (km)</span>
        <ngx-slider [options]="localOptions" formControlName="local"></ngx-slider>
      </div>
      <div class="custom-slider">
        <span>Tags minimum</span>
        <ngx-slider [options]="tagsOptions" formControlName="tags"></ngx-slider>
      </div>
      <button class="primary-button">Filtrer</button>
    </form>
  `,
  styleUrls: ["./filter-and-sort.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterAndSortComponent implements OnInit {
  @Output() public usersSort = new EventEmitter<Observable<User[]>>();

  constructor(
    private matchService: matchService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  usersMatch = [];

  sortOptions = [
    { name: "Aucun", id: "0" },
    { name: "Age", id: "age" },
    { name: "Score de popularité", id: "popu" },
    { name: "Distance", id: "local" },
    { name: "Nombre de tags en commun", id: "tags" },
  ];

  sliderForm: FormGroup = new FormGroup({
    age: new FormControl([18, 30]),
    score: new FormControl(50),
    local: new FormControl(10),
    tags: new FormControl(3),
    sortBy: new FormControl("0"),
  });

  ageOptions: Options = {
    floor: 18,
    ceil: 150,
    minRange: 4,
    hideLimitLabels: true,
  };

  scoreOptions: Options = {
    floor: 0,
    ceil: 100,
    showSelectionBar: true,
  };

  localOptions: Options = {
    floor: 0,
    ceil: 4000,
    showSelectionBar: true,
  };

  tagsOptions: Options = {
    floor: 0,
    ceil: 100,
    showSelectionBar: true,
  };

  ngOnInit(): void {
    this.matchService.getSuggestion(JSON.parse(localStorage.getItem("id"))).subscribe(
      data => {
        console.log(data);
        this.usersMatch = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  sortUsersBy(by) {
    this.matchService
      .sortUsersBy(this.usersMatch, by, JSON.parse(localStorage.getItem("id")))
      .subscribe(
        data => {
          console.log(data);
          this.usersMatch = data.usersSort;
        },
        err => {
          console.log(err);
        }
      );
  }

  filtreUsersBy() {
    this.matchService
      .filtreUsersBy(JSON.parse(localStorage.getItem("id")), this.sliderForm.getRawValue())
      .subscribe(
        data => {
          console.log(data);
          this.usersMatch = data;
        },
        err => {
          console.log(err);
        }
      );
    this.usersSort.emit(
      this.matchService.filtreUsersBy(
        JSON.parse(localStorage.getItem("id")),
        this.sliderForm.getRawValue()
      )
    );
  }

  viewProfil(id) {
    console.log(id);
    this.router.navigate(["home/profile-view/" + id]);
  }
}
