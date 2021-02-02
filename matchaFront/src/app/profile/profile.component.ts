import { Router } from "@angular/router";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { User } from "@matcha/shared";
import { profilService } from "../_service/profil_service";
import { DomSanitizer } from "@angular/platform-browser";
import { Dimensions, ImageCroppedEvent } from "ngx-image-cropper";
import { NgxImageCompressService } from "ngx-image-compress";
import { forkJoin } from "rxjs";
import { userService } from '../_service/user_service';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {differenceInCalendarYears, differenceInYears, isAfter, isBefore} from 'date-fns'



function ValidatorLength(control: FormControl) {
 if (control.value.length < 3) {
   return {error: "3 caractères minimum"}
 } else if (control.value.length > 20) {
   return {error: "20 caractères maximum"}
 }
}

function ValidatorBio(control: FormControl) {
  if (control.value.length === 0) {
    return {error: "Champs obligatoire"}
  } else if (control.value.length > 300) {
    return {error: "300 caractères maximun"}
  }
}

function ValidatorEmail(control: FormControl) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(control.value).toLowerCase())) {
    return {error: "Mauvais format"}
  }
}

function ValidatorBirthDate(control: FormControl) {
  if (isBefore(new Date(control.value), new Date("1900-01-01"))) {
    return {error: "Vous êtes mort"}
  } else if (isAfter(new Date(control.value), new Date())) {
    return {error: "Vous venez du futur"}
  } else if (differenceInYears(new Date(), new Date(control.value)) < 18) {
    return {error: "Avez-vous 18 ans ?"}
  }
}


function ValidatorSelect(control: FormControl) {
  if (control.value === "") {
    return {error: "Veuillez sélectionner une option"}
  }
}
@Component({
  selector: "profile",
  template: `
    <div class="content" [class.quick-look]="!this.updateMode">
      <div class="header-bar">
        <span
          class="case separator"
          [class.selected]="!this.updateMode"
          (click)="changeUpdateMode(false)"
          >Aperçu</span
        >
        <span
          class="case"
          [class.selected]="this.updateMode"
          (click)="changeUpdateMode(true)"
          >Modifier</span
        >
      </div>
      <div *ngIf="!this.updateMode" class="big-profile-picture">
        <img [src]="this.user.pictures[0].url ? this.user.pictures[0].url : './assets/user.svg'" />
      </div>
      <div>
      <span>{{this.form.userName}}</span>
      <span>{{this.form.firstName}} {{this.form.lastName}}</span>
      </div>
      <div class="profile-pictures" *ngIf="this.updateMode">
        <form class="grid">
          <label class="profile-picture" for="fileInput1">
            <input
              [disabled]="this.form.pictures[0]?.url"
              id="fileInput1"
              class="input-file"
              accept="image/*"
              type="file"
              (change)="this.fileChangeEvent($event, '0')"
            />
            <img
              [src]="
                this.form.pictures[0].url
                  ? this.form.pictures[0].url
                  : './assets/user.svg'
              "
            />
            <div class="delete" (click)="this.delete('0')"><img src="./assets/x.svg"></div>
          </label>
          <label class="profile-picture" for="fileInput2">
            <input
              [disabled]="this.form.pictures[1]?.url"
              id="fileInput2"
              class="input-file"
              accept="image/*"
              type="file"
              (change)="this.fileChangeEvent($event, '1')"
            />
            <img
              [src]="
                this.form.pictures[1].url
                  ? this.form.pictures[1].url
                  : './assets/user.svg'
              "
            />
          </label>
          <label class="profile-picture" for="fileInput3">
            <input
              [disabled]="this.form.pictures[2]?.url"
              id="fileInput3"
              class="input-file"
              accept="image/*"
              type="file"
              (change)="this.fileChangeEvent($event, '2')"
            />
            <img
              [src]="
                this.form.pictures[2].url
                  ? this.form.pictures[2].url
                  : './assets/user.svg'
              "
            />
          </label>
          <label class="profile-picture" for="fileInput4">
            <input
              [disabled]="this.form.pictures[3]?.url"
              id="fileInput4"
              class="input-file"
              accept="image/*"
              type="file"
              (change)="this.fileChangeEvent($event, '3')"
            />
            <img
              [src]="
                this.form.pictures[3].url
                  ? this.form.pictures[3].url
                  : './assets/user.svg'
              "
            />
          </label>
          <label class="profile-picture" for="fileInput5">
            <input
              [disabled]="this.form.pictures[4]?.url"
              id="fileInput5"
              class="input-file"
              accept="image/*"
              type="file"
              (change)="this.fileChangeEvent($event, '4')"
            />
            <img
              [src]="
                this.form.pictures[4].url
                  ? this.form.pictures[4].url
                  : './assets/user.svg'
              "
            />
          </label>
          <label class="profile-picture" for="fileInput6">
            <input
              [disabled]="this.form.pictures[5]?.url"
              id="fileInput6"
              class="input-file"
              accept="image/*"
              type="file"
              (change)="this.fileChangeEvent($event, '5')"
            />
            <img
              [src]="
                this.form.pictures[5].url
                  ? this.form.pictures[5].url
                  : './assets/user.svg'
              "
            />
          </label>
        </form>
      </div>
      <form [formGroup]="this.userForm" *ngIf="this.updateMode" class="form-container" name="form" (ngSubmit)="f.form.valid && onSubmit()" #f="ngForm" novalidate>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Nom d'utilisateur</span>
          <input
            type="text"
            formControlName="userName"
            id="userName"
            required
            placeholder="Nom d'utilisateur"
          />
          <div class="error" *ngIf="this.userForm.get('userName').errors?.error">{{this.userForm.get('userName').errors.error}}</div>
        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Nom</span>
          <input
            type="text"
            formControlName="lastName"
            required
            placeholder="Nom"
          />
          <div class="error" *ngIf="this.userForm.get('lastName').errors?.error">{{this.userForm.get('lastName').errors.error}}</div>

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
          <div class="error" *ngIf="this.userForm.get('firstName').errors?.error">{{this.userForm.get('firstName').errors.error}}</div>
        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Email</span>
          <input
            formControlName="email"
            required
            placeholder="Email"
          />
          <div class="error" *ngIf="this.userForm.get('email').errors?.error">{{this.userForm.get('email').errors.error}}</div>

        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Date de naissance</span>
          <input
            type="date"
            formControlName="birthDate"
            min="1900-01-01"
            max="{{this.date | date:'yyyy-MM-dd'}}"
            required
            placeholder="Date de naissance"
          />
          <div class="error" *ngIf="this.userForm.get('birthDate').errors?.error">{{this.userForm.get('birthDate').errors.error}}</div>

        </div>
        <div *ngIf="this.updateMode || form.bio" class="info-container">
          <span class="info-top">Bio</span>
          <textarea
            type="text"
            class="form-control"
            formControlName="bio"
            placeholder="bio"
          ></textarea>
          <div class="error" *ngIf="this.userForm.get('bio').errors?.error">{{this.userForm.get('bio').errors.error}}</div>
        </div>
        <div *ngIf="this.updateMode || form.gender" class="info-container">
          <span class="info-top">Je suis un(e)</span>
          <select
            *ngIf="this.updateMode"
            formControlName="gender"
          >
            <option id="Homme" name="Homme" value="1">Homme</option>
            <option id="Femme" name="Femme" value="2">Femme</option>
            <option id="Kamoulox" name="Kamoulox" value="3">Kamoulox</option>
          </select>
          <div class="error" *ngIf="this.userForm.get('gender').errors?.error">{{this.userForm.get('gender').errors.error}}</div>
        </div>
        <div *ngIf="this.updateMode || form.gender" class="info-container">
          <span class="info-top">Je veux rencontrer</span>
          <select
            formControlName="showMe"
          >
            <option id="Homme" name="Homme" value="1">des hommes</option>
            <option id="Femme" name="Femme" value="2">des femmes</option>
            <option id="Kamoulox" name="Kamoulox" value="3">les deux</option>
          </select>
          <div class="error" *ngIf="this.userForm.get('showMe').errors?.error">{{this.userForm.get('showMe').errors.error}}</div>
        </div>
        <app-tags></app-tags>
        <button
          [disabled]="!this.userForm.valid"
          (ngSubmit)="onSubmit()"
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
  `,
  styleUrls: ["./profile.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProfileComponent implements OnInit {
  @Input() user: User;

  public date = new Date()

  public form: Partial<User> = {};
  public userForm = new FormGroup({
    userName: new FormControl('', ValidatorLength),
    firstName: new FormControl('', ValidatorLength),
    lastName: new FormControl('', ValidatorLength),
    birthDate: new FormControl('', ValidatorBirthDate),
    gender: new FormControl('', ValidatorSelect),
    showMe: new FormControl('', ValidatorSelect),
    bio: new FormControl('', ValidatorBio),
    email: new FormControl('', ValidatorEmail)
  })
  public url = "";
  public updateMode = false;
  public saveEmail = "";

  public imageChangedEvent: any = "";
  public croppedImage: any = "";
  public showCropper = false;
  public pictureId = "";

  constructor(
    private profilService: profilService,
    private route: Router,
    private sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService,
    private userService: userService
  ) { }

  ngOnInit() {
    this.user = this.userService.setUserNull();
    this.userService.getUser(JSON.parse(localStorage.getItem('id'))).then((res: User) => {
      this.user = {
        userName: res["userName"],
        firstName: res["firstName"],
        lastName: res["lastName"],
        birthDate: res["birthDate"],
        password: res["password"],
        email: res["email"],
        id: res["id"],
        gender: res["gender"],
        showMe: res["showMe"],
        bio: res["bio"],
        score: res["score"],
        city: res["city"],
        latitude: res["latitude"],
        longitude: res["longitude"],
        emailVerify: res["emailVerify"],
        profileComplete: res["profileComplete"],
        link: res["link"],
        pictures: [
          {id: "picture1", url: res["picture1"] as string},
          {id: "picture2", url: res["picture2"] as string},
          {id: "picture3", url: res["picture3"] as string},
          {id: "picture4", url: res["picture4"] as string},
          {id: "picture5", url: res["picture5"] as string},
          {id: "picture6", url: res["picture6"] as string},
        ]
      };
      this.userForm.patchValue({
        userName: res.userName,
        firstName: res.firstName,
        lastName: res.lastName,
        birthDate: res.birthDate,
        gender: res.gender,
        showMe: res.showMe,
        bio: res.bio,
        email: res.email
      })
      this.form = this.user;
      this.saveEmail = this.user.email;
    });
  }

  public changeUpdateMode(updateMode: boolean) {
    this.updateMode = updateMode;
  }

  public onSelectFile(event, id?: string) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        if (!id) {
          this.url = event.target.result as string;
        } else if (id) {
          this.form.pictures[id].url = event.target.result as string;
        }
      };
    }
  }

  public onSubmit() {
    forkJoin(this.form.pictures.map(picture => this.profilService.uploadPicture(picture, this.saveEmail))).subscribe(el => console.log(el))
    this.profilService.update(this.userForm.getRawValue(), this.saveEmail).subscribe(
      (data) => {
        console.log(data);
        if (data.status == true) {
          this.route.navigate(["home/profile"]);
        }
      },
      (err) => { }
    );
  }

  public delete(id: string) {
    this.form.pictures[id].url = "";
    this.form.pictures = this.form.pictures.sort((a, b) => {
      if(a.url === "" || a.url === null) {
        return 1;
      } else if(b.url === "" || b.url === null) {
        const tmp = b.id;
        b.id = a.id;
        a.id = tmp;
        return -1
      } else {
        return 0;
      }
    });
  }

  public fileChangeEvent(event: any, pictureId: string): void {
    this.pictureId = pictureId;
    this.imageChangedEvent = event;
  }
  public imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  public imageLoaded() {
    this.showCropper = true;
    console.log("Image loaded");
  }

  public cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
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

    this.imageCompress.compressFile(imgResultBeforeCompress, -1, 50, 50).then(
      result => {
        imgResultAfterCompress = result;
        console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
        this.form.pictures[this.pictureId].url = imgResultAfterCompress;
        this.form.pictures = this.form.pictures.sort((a, b) => {
          if(a.url === "" || a.url === null) {
            return 1;
          } else if(b.url === "" || b.url === null) {
            const tmp = b.id;
            b.id = a.id;
            a.id = tmp;
            return -1
          } else {
            return 0;
          }
        });
      }
    );

  }
}
