import { Router } from "@angular/router";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Tags, User } from "@matcha/shared";
import { profilService } from "../_service/profil_service";
import { Dimensions, ImageCroppedEvent } from "ngx-image-cropper";
import { NgxImageCompressService } from "ngx-image-compress";
import { combineLatest, forkJoin, Observable, Subject } from "rxjs";
import { userService } from "../_service/user_service";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { differenceInYears, isAfter, isBefore } from "date-fns";
import { MatDialog } from "@angular/material/dialog";
import { PopUpComponent } from "../pop-up/pop-up.component";
import { EventEmitter } from "events";

declare var google: any;

function ValidatorUserNameLength(control: FormControl) {
  const test = /^(?=.{3,20}$)[a-zA-Z0-9]+(?:[-' ][a-zA-Z0-9]+)*$/;
  if (control.value?.length < 3) {
    return { error: "3 caractères minimum" };
  } else if (control.value?.length > 20) {
    return { error: "20 caractères maximum" };
  } else if (!test.test(String(control.value).toLowerCase())) {
    return { error: "Mauvais format" };
  }
}

function ValidatorLength(control: FormControl) {
  const test = /^(?=.{3,20}$)[a-zA-Z]+(?:[-' ][a-zA-Z]+)*$/;
  if (control.value?.length < 3) {
    return { error: "3 caractères minimum" };
  } else if (control.value?.length > 20) {
    return { error: "20 caractères maximum" };
  } else if (!test.test(String(control.value).toLowerCase())) {
    return { error: "Mauvais format" };
  }
}

function ValidatorBio(control: FormControl) {
  if (control.value?.length === 0) {
    return { error: "Champs obligatoire" };
  } else if (control.value?.length > 300) {
    return { error: "300 caractères maximun" };
  }
}

function ValidatorTags(arr: FormArray) {
  let tmp = arr.getRawValue();
  if (tmp?.length === 0) {
    return { error: "Vous devez avoir au minimun un tag" };
  }
}

function ValidatorEmail(control: FormControl) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(control.value).toLowerCase())) {
    return { error: "Mauvais format" };
  }
}

function ValidatorBirthDate(control: FormControl) {
  if (control.value === "") {
    return { error: "Champs obligatoire" };
  } else if (isBefore(new Date(control.value), new Date("1900-01-01"))) {
    return { error: "Vous êtes mort" };
  } else if (isAfter(new Date(control.value), new Date())) {
    return { error: "Vous venez du futur" };
  } else if (differenceInYears(new Date(), new Date(control.value)) < 18) {
    return { error: "Avez-vous 18 ans ?" };
  }
}

function ValidatorSelect(control: FormControl) {
  if (control.value === "") {
    return { error: "Veuillez sélectionner une option" };
  }
}

function validatePictures(arr: FormArray) {
  let pictures = arr.getRawValue();
  if (pictures.every(picture => picture.url === "" || picture.url === null))
    return { error: "Une photo minimum est requise" };
}
@Component({
  selector: "profile",
  template: `
    <div
      class="content"
      *ngIf="this.user && !this.isSettings"
      [class.quick-look]="!this.updateMode"
    >
      <div class="header-bar">
        <span
          class="case separator"
          [class.selected]="!this.updateMode"
          (click)="changeUpdateMode(false)"
          >Aperçu</span
        >
        <span class="case" [class.selected]="this.updateMode" (click)="changeUpdateMode(true)"
          >Modifier</span
        >
      </div>
      <div *ngIf="!this.updateMode" class="big-profile-picture">
        <img class="setting" src="./assets/settings.svg" (click)="this.openSettings()" />
        <img
          class="chevron"
          [class.hidden]="!this.user?.pictures[0] || this.primaryPictureId === 0"
          (click)="this.primaryPictureId = this.primaryPictureId - 1"
          src="./assets/chevron-left.svg"
        />
        <img
          class="picture"
          [src]="
            this.user?.pictures[this.primaryPictureId] &&
            this.user?.pictures[this.primaryPictureId].url
              ? this.user?.pictures[this.primaryPictureId].url
              : './assets/user.svg'
          "
        />
        <img
          class="chevron"
          [class.hidden]="
            !this.user?.pictures[0] || !this.user?.pictures[this.primaryPictureId + 1].url
          "
          (click)="this.primaryPictureId = this.primaryPictureId + 1"
          src="./assets/chevron-right.svg"
        />
        <div class="primary-button score">
          {{ this.user?.score }}
          <img src="./assets/star.svg" />
        </div>
      </div>
      <div *ngIf="!this.updateMode" class="content-name">
        <span
          >{{ this.user?.userName }}
          {{
            this.getAge(this.user?.birthDate) ? this.getAge(this.user?.birthDate) + " ans" : ""
          }}</span
        >
        <span>{{ this.user?.firstName }} {{ this.user?.lastName }}</span>
      </div>
      <div *ngIf="!this.updateMode" class="form-container">
        <div class="info-container">
          <span class="info-top">Je suis</span>
          <span class="info-bottom">{{
            this.user?.gender !== undefined && this.genderOptions[this.user?.gender.toString()]
          }}</span>
        </div>
        <div class="info-container">
          <span class="info-top">Je veux rencontrer</span>
          <span class="info-bottom">{{
            this.user?.showMe !== undefined && this.showOptions[this.user?.showMe.toString()]
          }}</span>
        </div>
        <div class="info-container">
          <span class="info-top">Bio</span>
          <span class="info-bottom">{{ this.user?.bio }}</span>
        </div>
        <app-tags [showMode]="'true'"></app-tags>
      </div>
      <form
        [formGroup]="this.userForm"
        *ngIf="this.updateMode"
        class="form-container"
        name="form"
        (ngSubmit)="f.form.valid && onSubmit()"
        #f="ngForm"
        novalidate
      >
        <div class="profile-pictures" *ngIf="this.updateMode">
          <form class="grid">
            <label
              *ngFor="let picture of this.pictures.value; let index = index"
              class="profile-picture"
              [for]="'fileInput' + (index + 1)"
            >
              <input
                [disabled]="picture.url"
                [id]="'fileInput' + (index + 1)"
                class="input-file"
                accept="image/jpeg, image/png"
                type="file"
                (change)="this.fileChangeEvent($event, index.toString())"
              />
              <img
                [src]="picture.url && picture.url !== 'delete' ? picture.url : './assets/plus.svg'"
              />
              <div
                *ngIf="picture.url && picture.url !== 'delete'"
                class="delete"
                (click)="this.delete(index.toString())"
              >
                <img src="./assets/x.svg" />
              </div>
            </label>
          </form>
          <div class="error picture" *ngIf="this.userForm.get('pictures')?.errors?.error">
            {{ this.userForm.get("pictures").errors.error }}
          </div>
        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Nom d'utilisateur</span>
          <input
            type="text"
            formControlName="userName"
            id="userName"
            required
            placeholder="Nom d'utilisateur"
          />
          <div class="error" *ngIf="this.userForm.get('userName').errors?.error">
            {{ this.userForm.get("userName").errors.error }}
          </div>
        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Nom</span>
          <input type="text" formControlName="lastName" required placeholder="Nom" />
          <div class="error" *ngIf="this.userForm.get('lastName').errors?.error">
            {{ this.userForm.get("lastName").errors.error }}
          </div>
        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Prénom</span>
          <input
            *ngIf="this.updateMode"
            type="text"
            formControlName="firstName"
            required
            placeholder="Prénom"
          />
          <div class="error" *ngIf="this.userForm.get('firstName').errors?.error">
            {{ this.userForm.get("firstName").errors.error }}
          </div>
        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Email</span>
          <input formControlName="email" required placeholder="Email" />
          <div class="error" *ngIf="this.userForm.get('email').errors?.error">
            {{ this.userForm.get("email").errors.error }}
          </div>
        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Date de naissance</span>
          <input
            type="date"
            formControlName="birthDate"
            min="1900-01-01"
            max="{{ this.date | date: 'yyyy-MM-dd' }}"
            required
            placeholder="Date de naissance"
          />
          <div class="error" *ngIf="this.userForm.get('birthDate').errors?.error">
            {{ this.userForm.get("birthDate").errors.error }}
          </div>
        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Bio</span>
          <textarea
            type="text"
            class="form-control"
            formControlName="bio"
            placeholder="bio"
          ></textarea>
          <div class="error" *ngIf="this.userForm.get('bio').errors?.error">
            {{ this.userForm.get("bio").errors.error }}
          </div>
        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Je suis un(e)</span>
          <select *ngIf="this.updateMode" formControlName="gender">
            <option id="Homme" name="Homme" value="1">Homme</option>
            <option id="Femme" name="Femme" value="2">Femme</option>
            <option id="Kamoulox" name="Kamoulox" value="3">autre</option>
          </select>
          <div class="error" *ngIf="this.userForm.get('gender').errors?.error">
            {{ this.userForm.get("gender").errors.error }}
          </div>
        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Je veux rencontrer</span>
          <select formControlName="showMe">
            <option id="Homme" name="Homme" value="1">des hommes</option>
            <option id="Femme" name="Femme" value="2">des femmes</option>
            <option id="Kamoulox" name="Kamoulox" value="3">peu importe</option>
          </select>
          <div class="error" *ngIf="this.userForm.get('showMe').errors?.error">
            {{ this.userForm.get("showMe").errors.error }}
          </div>
        </div>
        <app-tags
          (addExist)="this.addExistTag($event)"
          (addNew)="this.addNewTag($event)"
          (delete)="this.deleteTag($event)"
        ></app-tags>
        <div class="error" *ngIf="this.userForm.get('tags').errors?.error">
          {{ this.userForm.get("tags").errors.error }}
        </div>
        <button
          [disabled]="!this.userForm.valid"
          (ngSubmit)="this.onSubmit()"
          *ngIf="this.updateMode"
          class="primary-button"
        >
          enregistrer
        </button>
      </form>
      <div class="cropper-container" [style.display]="this.showCropper ? null : 'none'">
        <image-cropper
          class="cropper"
          [imageChangedEvent]="imageChangedEvent"
          [maintainAspectRatio]="true"
          format="jpeg"
          [imageQuality]="90"
          [backgroundColor]="'transparent'"
          [style.display]="this.showCropper ? null : 'none'"
          (imageCropped)="imageCropped($event)"
          (imageLoaded)="imageLoaded()"
          (cropperReady)="cropperReady($event)"
          (loadImageFailed)="loadImageFailed()"
        >
        </image-cropper>
        <div class="primary-button" (click)="this.confirmCropped()">OK</div>
      </div>
    </div>
    <div *ngIf="this.user !== undefined" [class.hidden]="!this.isSettings" class="content">
      <div class="header-bar">
        <span class="case middle"> Paramètres </span>
        <img class="cross" src="./assets/x.svg" (click)="this.isSettings = false" />
      </div>
      <div class="form-container">
        <div class="info-container">
          <span class="info-top">Changer sa localisation</span>
          <select (change)="this.getLocation()" [formControl]="this.localizationCase">
            <option value="1">Localisation actuelle</option>
            <option value="0">Choisir sa localisation</option>
          </select>
          <input
            [disabled]="this.localizationCase.value === '1'"
            class="input-loca"
            #loca
            placeholder="Localisation"
          />
          <div class="error" *ngIf="this.errorLoca">Veuillez entrer une ville existante.</div>
        </div>
        <div class="primary-button" (click)="this.saveLocalization()">Enregistrer</div>
        <div class="info-container">
          <span class="info-top">Changer son mot de passe</span>

          <a class="primary-button no-margin" routerLink="/forgotPass" routerLinkActive="active">
            Changer son Mot de passe
          </a>
        </div>
        <div class="info-container">
          <span class="info-top">Changer de mode</span>

          <div class="primary-button" (click)="this.changeTheme()">{{ this.getTheme() }}</div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./profile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  @Output() public activate = new EventEmitter();
  @ViewChild("loca", { static: false }) loca: ElementRef;

  optionsMap = {
    types: ["(cities)"],
  };

  public autocomplete: any;

  public genderOptions: { [key_id: string]: string } = {
    "1": "un Homme",
    "2": "une Femme",
    "3": "autre",
  };

  public showOptions: { [key_id: string]: string } = {
    "1": "des Hommes",
    "2": "des Femmes",
    "3": "peu importe",
  };

  public primaryPictureId = 0;
  public date = new Date();

  public user: User = undefined;
  public yourTags: Tags[] = [];

  public userForm = new FormGroup({
    userName: new FormControl("", ValidatorUserNameLength),
    firstName: new FormControl("", ValidatorLength),
    lastName: new FormControl("", ValidatorLength),
    birthDate: new FormControl("", ValidatorBirthDate),
    gender: new FormControl("", ValidatorSelect),
    showMe: new FormControl("", ValidatorSelect),
    bio: new FormControl("", ValidatorBio),
    email: new FormControl("", ValidatorEmail),
    pictures: new FormArray(
      [
        new FormGroup({
          id: new FormControl(""),
          url: new FormControl(""),
        }),
        new FormGroup({
          id: new FormControl(""),
          url: new FormControl(""),
        }),
        new FormGroup({
          id: new FormControl(""),
          url: new FormControl(""),
        }),
        new FormGroup({
          id: new FormControl(""),
          url: new FormControl(""),
        }),
        new FormGroup({
          id: new FormControl(""),
          url: new FormControl(""),
        }),
      ],
      validatePictures
    ),
    tags: new FormArray([], ValidatorTags),
  });

  public localizationCase = new FormControl("1");

  public pictures = this.userForm.get("pictures") as FormArray;
  public url = "";
  public updateMode = false;
  public saveEmail = "";

  public imageChangedEvent: any = "";
  public croppedImage: any = "";
  public showCropper = false;
  public pictureId = "";

  public isSettings = false;
  public errorLoca = false;

  public lat: number;
  public long: number;

  constructor(
    private profilService: profilService,
    private route: Router,
    private cd: ChangeDetectorRef,
    private imageCompress: NgxImageCompressService,
    private userService: userService,
    private zone: NgZone,
    private dialog: MatDialog
  ) {}
  private unsubscribe = new Subject<void>();

  // public yourTags$: Observable<Tags[]> = interval(500).pipe(
  //   switchMap(() => this.userService.getYourTags(JSON.parse(localStorage.getItem("id"))))
  // );

  // public allTags$: Observable<Tags[]> = interval(500).pipe(
  //   switchMap(() => this.userService.getAllTags())
  // );

  public yourTags$: Observable<Tags[]> = this.userService.getYourTags(
    JSON.parse(localStorage.getItem("id"))
  );

  public allTags$: Observable<Tags[]> = this.userService.getAllTags();

  public user$: Observable<User> = this.userService.getUser(JSON.parse(localStorage.getItem("id")));

  ngOnInit(): void {
    combineLatest([
      this.userService.getYourTags(JSON.parse(localStorage.getItem("id"))),
      this.userService.getUser(JSON.parse(localStorage.getItem("id"))),
    ])
      .toPromise()
      .then(([tagsRes, res]) => {
        this.userForm.patchValue({
          userName: res.userName,
          firstName: res.firstName,
          lastName: res.lastName,
          birthDate: res.birthDate,
          gender: res.gender,
          showMe: res.showMe,
          bio: res.bio,
          email: res.email,
          pictures: res.pictures,
        });
        this.yourTags = tagsRes;
        (this.userForm.get("tags") as FormArray).clear();
        tagsRes.forEach(tag => {
          (this.userForm.get("tags") as FormArray).push(
            new FormGroup({
              id: new FormControl(tag.id),
              name: new FormControl(tag.name),
            })
          );
        });
        this.user = res;
        this.saveEmail = res.email;

        this.cd.detectChanges();
      });
  }

  public getLocation() {
    let result;
    if (this.localizationCase.value === "1") {
      if (
        typeof navigator.geolocation === "object" &&
        typeof navigator.geolocation.getCurrentPosition === "function"
      ) {
        navigator.geolocation.getCurrentPosition(
          position => {
            let geocoder = new google.maps.Geocoder();

            this.lat = position.coords.latitude;
            this.long = position.coords.longitude;
            var geolocate = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );

            geocoder.geocode({ latLng: geolocate }, (results, status) => {
              if (status == google.maps.GeocoderStatus.OK) {
                if (results.length > 1) {
                  result = results[1];
                } else {
                  result = results[0];
                }
                //console.log(result);
              }
              this.loca.nativeElement.value =
                result.address_components[2].long_name +
                ", " +
                result.address_components[3].long_name;
            });
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }

  public changeUpdateMode(updateMode: boolean) {
    const tmpUser = this.userForm.getRawValue();
    if (
      this.updateMode &&
      this.userForm.valid &&
      (this.user?.email !== tmpUser?.email ||
        this.user?.userName !== tmpUser?.userName ||
        this.user?.firstName !== tmpUser?.firstName ||
        this.user?.lastName !== tmpUser?.lastName ||
        this.user?.birthDate !== tmpUser?.birthDate ||
        this.user?.bio !== tmpUser?.bio ||
        this.user?.gender !== tmpUser?.gender ||
        this.user?.showMe !== tmpUser?.showMe ||
        JSON.stringify(this.user?.pictures) !== JSON.stringify(tmpUser?.pictures) ||
        JSON.stringify(this.yourTags) !== JSON.stringify(tmpUser?.tags))
    ) {
      let dialogRef = this.dialog.open(PopUpComponent, {
        data: {
          title: "Attention",
          message: "Vous n'avez pas enregisté vos changements. Voulez-vous les enregistrer ?",
          two: true,
        },
      });
      dialogRef.afterClosed().subscribe(
        res => {
          if (res === true) {
            this.onSubmit();
            this.updateMode = updateMode;
            this.cd.detectChanges();
          } else if (res === false) {
            this.updateMode = updateMode;

            this.cd.detectChanges();
          }
          this.updateMode = updateMode;
          this.cd.detectChanges();
        },
        err => {
          this.route.navigate(["/maintenance"]);
        }
      );

      console.log("diff");
    } else {
      this.updateMode = updateMode;
    }
    //this.updateMode = updateMode;
    this.primaryPictureId = 0;
    //this.cd.detectChanges();
  }

  public openSettings() {
    this.isSettings = true;
    this.cd.detectChanges();

    this.autocomplete = new google.maps.places.Autocomplete(
      this.loca?.nativeElement as any,
      this.optionsMap
    );
    this.getLocation();
  }

  public onSubmit() {
    const form: User = this.userForm.getRawValue();
    forkJoin(
      form.pictures.map(picture => this.profilService.uploadPicture(picture, this.saveEmail))
    ).subscribe(
      el => console.log(el),
      err => {
        this.route.navigate(["/maintenance"]);
      }
    );
    this.profilService.update(form, this.saveEmail, true).subscribe(
      data => {
        console.log(data);
        if (data.status == true) {
          this.ngOnInit();
          this.primaryPictureId = 0;
          let dialogRef = this.dialog.open(PopUpComponent, {
            data: {
              title: "C'est bon !",
              message: "Vos modifications ont bien été enregistré.",
              button: "Ok !",
            },
          });
          dialogRef.afterClosed().subscribe(el => {
            this.updateMode = false;
            this.cd.detectChanges();
          });
        }
      },
      err => {
        this.route.navigate(["/maintenance"]);
      }
    );
  }

  public delete(id: string) {
    let tmpArray: {
      id: string;
      url: string;
    }[] = this.pictures.getRawValue();
    tmpArray[id].url = "delete";
    tmpArray = tmpArray.sort((a, b) => {
      if (a.url === "delete" || a.url === null) {
        return 1;
      } else if (b.url === "delete" || b.url === null) {
        const tmp = b.id;
        b.id = a.id;
        a.id = tmp;
        return -1;
      } else {
        return 0;
      }
    });
    tmpArray = tmpArray.map(picture => {
      if (picture.url === "delete") {
        return { ...picture, url: "" };
      } else {
        return picture;
      }
    });
    this.pictures.patchValue(tmpArray);
    this.cd.detectChanges();
  }

  public fileChangeEvent(event: any, pictureId: string): void {
    this.pictureId = pictureId;
    this.validateAndUpload(event);
  }

  public validateAndUpload(event) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (file) {
        const img = new Image();

        img.onload = () => {
          const height = img.naturalHeight;
          const width = img.naturalWidth;
          console.log("Width and Height", width, height);
          this.imageChangedEvent = event;
          this.cd.detectChanges();
        };
        if ((reader.result as string).length > 5) {
          img.src = reader.result as string;
        } else {
          let dialogRef = this.dialog.open(PopUpComponent, {
            data: {
              title: "Attention",
              message: "Votre photo n'est pas valide, veuillez essayer avec une autre photo.",
            },
          });
        }
      }
    };
  }
  public imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  public imageLoaded() {
    console.log("Image loaded");
    if (this.updateMode) {
      this.showCropper = true;
    }
  }

  public cropperReady(sourceImageDimensions: Dimensions) {
    console.log("Cropper ready", sourceImageDimensions);
  }
  public loadImageFailed() {
    console.log("image fail");
  }

  public confirmCropped() {
    this.compressFile(this.croppedImage);
    this.showCropper = false;
  }

  public compressFile(imgResultBeforeCompress: string) {
    let imgResultAfterCompress = "";

    this.imageCompress.compressFile(imgResultBeforeCompress, -1, 50, 50).then(result => {
      imgResultAfterCompress = result;
      let tmpArray: {
        id: string;
        url: string;
      }[] = this.pictures.getRawValue();
      tmpArray[this.pictureId].url = imgResultAfterCompress;
      tmpArray = tmpArray.sort((a, b) => {
        if (a.url === "" || a.url === null) {
          return 1;
        } else if (b.url === "" || b.url === null) {
          const tmp = b.id;
          b.id = a.id;
          a.id = tmp;
          return -1;
        } else {
          return 0;
        }
      });
      this.pictures.patchValue(tmpArray);
      this.cd.detectChanges();
    });
  }

  public getAge(birthDate: Date) {
    return differenceInYears(new Date(), new Date(birthDate));
  }

  addExistTag(tagId: string) {
    this.userService.addExistTag(JSON.parse(localStorage.getItem("id")), tagId).subscribe(
      data => {
        console.log(data);
        if (data.status == true) {
          (this.userForm.get("tags") as FormArray).clear();
          this.yourTags$.toPromise().then(el => {
            el.forEach(tag => {
              (this.userForm.get("tags") as FormArray).push(
                new FormGroup({
                  id: new FormControl(tag.id),
                  name: new FormControl(tag.name),
                })
              );
            });
          });
          this.yourTags$.subscribe(
            el => console.log(el),
            err => {
              this.route.navigate(["/maintenance"]);
            }
          );
          this.userForm.updateValueAndValidity();

          this.cd.detectChanges();
        }
      },
      err => {
        console.log(err);
      }
    );
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  addNewTag(tag: string) {
    this.userService.addNonExistTag(tag, JSON.parse(localStorage.getItem("id"))).subscribe(
      data => {
        console.log(data);
        if (data.status == true) {
          (this.userForm.get("tags") as FormArray).clear();
          this.yourTags$.toPromise().then(el => {
            el.forEach(tag => {
              (this.userForm.get("tags") as FormArray).push(
                new FormGroup({
                  id: new FormControl(tag.id),
                  name: new FormControl(tag.name),
                })
              );
            });
            this.cd.detectChanges();
          });
          this.userForm.updateValueAndValidity();

          this.cd.detectChanges();
        }
      },
      err => {
        console.log(err);
      }
    );
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  deleteTag(tagId: string) {
    this.userService.deleteTag(JSON.parse(localStorage.getItem("id")), tagId).subscribe(
      data => {
        this.zone.run(() => {
          console.log(data);
          if (data.status == true) {
            (this.userForm.get("tags") as FormArray).clear();
            this.yourTags$.toPromise().then(el => {
              el.forEach(tag => {
                (this.userForm.get("tags") as FormArray).push(
                  new FormGroup({
                    id: new FormControl(tag.id),
                    name: new FormControl(tag.name),
                  })
                );
              });
              this.cd.detectChanges();
            });
            this.yourTags$.subscribe(
              el => console.log(el),
              err => {
                this.route.navigate(["/maintenance"]);
              }
            );
            this.userForm.updateValueAndValidity();
            this.cd.detectChanges();
          }
        });
      },
      err => {
        console.log(err);
      }
    );
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  public saveLocalization() {
    const place = this.autocomplete.getPlace();
    if (place === undefined && this.localizationCase.value === "0") {
      this.errorLoca = true;
    } else {
      this.errorLoca = false;
      let lat: number;
      let lon: number;
      if (this.localizationCase.value === "1") {
        lat = this.lat;
        lon = this.long;
      } else if (this.localizationCase.value === "0") {
        lat = place.geometry.location.lat();
        lon = place.geometry.location.lng();
      }
      this.userService
        .updateUserPosition(
          JSON.parse(localStorage.getItem("id")),
          lat,
          lon,
          this.localizationCase.value
        )
        .subscribe(
          el => {
            if (typeof el === "string") {
              let dialogRef = this.dialog.open(PopUpComponent, {
                data: {
                  title: "C'est bon !",
                  message:
                    "Votre position a bien été mis à jour. Vous allez être redirigé sur votre profil.",
                },
              });
              dialogRef.afterClosed().subscribe(
                el => {
                  this.isSettings = false;
                  this.cd.detectChanges();
                },
                err => {
                  this.route.navigate(["/maintenance"]);
                }
              );
            }
          },
          err => {
            this.route.navigate(["/maintenance"]);
          }
        );
    }
  }

  public getTheme() {
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme") + " mode";
    } else {
      return "Light mode";
    }
  }

  public changeTheme() {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");

      localStorage.setItem("theme", "dark");
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
