import { Router } from "@angular/router";
import { Component, Input, OnInit } from "@angular/core";
import { User } from "@matcha/shared";
import { profilService } from "../_service/profil_service";
import { DomSanitizer } from "@angular/platform-browser";
import { Dimensions, ImageCroppedEvent } from "ngx-image-cropper";
import { NgxImageCompressService } from "ngx-image-compress";
import { forkJoin } from "rxjs";
import { userService } from '../_service/user_service';

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
      <div class="profile-pictures" *ngIf="this.updateMode">
        <form class="grid">
          <label class="profile-picture" for="fileInput1">
            <input
              [disabled]="this.form.pictures[0].url"
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
              [disabled]="this.form.pictures[1].url"
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
              [disabled]="this.form.pictures[2].url"
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
              [disabled]="this.form.pictures[3].url"
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
              [disabled]="this.form.pictures[4].url"
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
              [disabled]="this.form.pictures[5].url"
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
      <form class="form-container" name="form" (ngSubmit)="f.form.valid && onSubmit()" #f="ngForm" novalidate>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Nom d'utilisateur</span>
          <input
            type="text"
            name="userName"
            [(ngModel)]="form.userName"
            required
            minlength="3"
            maxlength="20"
            #userName="ngModel"
            placeholder="Nom d'utilisateur"
          />
        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Nom</span>
          <input
            type="text"
            name="lastName"
            [(ngModel)]="form.lastName"
            required
            minlength="3"
            maxlength="20"
            #lastName="ngModel"
            placeholder="Nom"
          />
        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Prénom</span>
          <input
            *ngIf="this.updateMode"
            type="text"
            name="FirstName"
            [(ngModel)]="form.firstName"
            required
            minlength="3"
            maxlength="20"
            #firstName="ngModel"
            placeholder="Prénom"
          />
        </div>
        <div *ngIf="this.updateMode" class="info-container">
          <span class="info-top">Email</span>
          <input
            *ngIf="this.updateMode"
            type="text"
            name="email"
            [(ngModel)]="form.email"
            required
            email
            #email="ngModel"
            placeholder="Email"
          />
        </div>
        <div *ngIf="this.updateMode || form.bio" class="info-container">
          <span class="info-top">Bio</span>
          <textarea
            *ngIf="this.updateMode"
            type="text"
            class="form-control"
            name="bio"
            [(ngModel)]="form.bio"
            #bio="ngModel"
            placeholder="bio"
          ></textarea>
          <p *ngIf="!this.updateMode">{{ form.bio }}</p>
        </div>
        <div *ngIf="this.updateMode || form.gender" class="info-container">
          <span class="info-top">Genre</span>
          <select
            [(ngModel)]="form.gender"
            *ngIf="this.updateMode"
            name="Genre"
          >
            <option id="Homme" name="Homme" value="0">Homme</option>
            <option id="Femme" name="Femme" value="1">Femme</option>
            <option id="Kamoulox" name="Kamoulox" value="2">Kamoulox</option>
          </select>
          <p *ngIf="!this.updateMode">{{ form.gender }}</p>
        </div>
        <button
          (ngSubmit)="onSubmit()"
          *ngIf="this.updateMode"
          class="primary-button"
        >
          enregistrer
        </button>
      </form>
      <app-tags *ngIf="!this.updateMode"></app-tags>
      <div class="cropper-container" [style.display]="this.showCropper ? null : 'none'">
        <image-cropper
              class="cropper"
              [imageChangedEvent]="imageChangedEvent"
              [maintainAspectRatio]="true"
              format="jpeg"
              [imageQuality]="80"
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
})
export class ProfileComponent implements OnInit {
  @Input() user: User;

  public form: Partial<User> = {};
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
    this.userService.getUser(JSON.parse(localStorage.getItem('id'))).then(res => {
      this.user = {
        userName: res["userName"],
        firstName: res["firstName"],
        lastName: res["lastName"],
        birthate: res["birthDate"],
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
    this.profilService.update(this.form, this.saveEmail).subscribe(
      (data) => {
        console.log(data);
        if (data.status == true) {
          localStorage.removeItem("user");
          localStorage.setItem("user", JSON.stringify(data.user));
          this.route.navigate(["home"]);
          window.location.reload();
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
