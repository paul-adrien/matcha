import { Filtre, User } from "./../../../libs/user";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { matchService } from "../_service/match_service";
import { Router } from "@angular/router";

@Component({
  selector: "app-suggestion",
  template: `
    <div class="content">
      <a (click)="sortUsersBy('age')"><button>Trier par age</button></a>
      <a (click)="sortUsersBy('local')"><button>Trier par localisation</button></a>
      <a (click)="sortUsersBy('popu')"><button>Trier par popularité</button></a>
      <a (click)="sortUsersBy('tags')"><button>Trier par tags</button></a>
      <form
        class="form-container"
        name="form"
        (ngSubmit)="f.form.valid && filtreUsersBy()"
        #f="ngForm"
        novalidate
      >
        <p>Age maximum</p>
        <input
          type="number"
          class="form-control"
          name="maxAge"
          [(ngModel)]="form.maxAge"
          required
          #maxAge="ngModel"
        />
        <p>Age minimum</p>
        <input
          type="number"
          class="form-control"
          name="minAge"
          [(ngModel)]="form.minAge"
          required
          #minAge="ngModel"
          value="150"
        />
        <p>Score minimum</p>
        <input
          type="number"
          class="form-control"
          name="score"
          [(ngModel)]="form.score"
          required
          #score="ngModel"
          value="0"
        />
        <p>distance maximum (km)</p>
        <input
          type="number"
          class="form-control"
          name="local"
          [(ngModel)]="form.local"
          required
          #local="ngModel"
          value="100000"
        />
        <p>Nombre de tag(s) minimum</p>
        <input
          type="number"
          class="form-control"
          name="tags"
          [(ngModel)]="form.tags"
          required
          #tags="ngModel"
          value="0"
        />
        <button class="primary-button">Filtrer</button>
      </form>
    </div>
  `,
  styleUrls: ["./suggestion.component.scss"],
})
export class SuggestionComponent implements OnInit {
  @Output() public usersSort = new EventEmitter<User[]>();
  constructor(private matchService: matchService, private router: Router) {}

  usersMatch = [];
  form: Filtre = {
    maxAge: 150,
    minAge: 0,
    score: 0,
    local: 3000,
    tags: 0,
    sortBy: "0",
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
    this.matchService.filtreUsersBy(JSON.parse(localStorage.getItem("id")), this.form).subscribe(
      data => {
        console.log(data);
        this.usersMatch = data.usersSort;
      },
      err => {
        console.log(err);
      }
    );
  }

  viewProfil(id) {
    console.log(id);
    this.router.navigate(["home/profile-view/" + id]);
  }
}
