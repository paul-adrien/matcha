import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginPageComponent } from "./login/login-page.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { VerifyComponent } from "./verify/verify.component";
import { ForgotPassComponent } from "./forgot-pass/forgot-pass.component";
import { ForgotPassChangeComponent } from "./forgot-pass-change/forgot-pass-change.component";
import { HomeComponent } from "./home/home.component";
import { ProfileComponent } from "./profile/profile.component";
import { NavigationBarComponent } from "./nav-bar/nav-bar.component";
import { DiscoverComponent } from "./discover/discover.component";
import { ProfilCardComponent } from "./profil-card/profil-card.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { NgxImageCompressService } from "ngx-image-compress";
import { TagsComponent } from "./tags/tags.component";
import { FilterAndSortComponent } from "./filter-and-sort/filter-and-sort.component";
import { HomeMessagingComponent } from "./home-messaging/home-messaging.component";
import { ProfileViewComponent } from "./profile-view/profile-view.component";
import { NotificationComponent } from "./notification/notification.component";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { DiscussionComponent } from "./discussion/discussion.component";
import { CommonModule } from "@angular/common";
import { MaintenanceComponent } from "./maintenance/maintenance.component";
import { InteractiveMapComponent } from "./interactive-map/interactive-map.component";
import { PopUpComponent } from "./pop-up/pop-up.component";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    VerifyComponent,
    ForgotPassComponent,
    ForgotPassChangeComponent,
    HomeComponent,
    ProfileComponent,
    NavigationBarComponent,
    DiscoverComponent,
    ProfilCardComponent,
    ProfileViewComponent,
    TagsComponent,
    FilterAndSortComponent,
    HomeMessagingComponent,
    NotificationComponent,
    DiscussionComponent,
    MaintenanceComponent,
    InteractiveMapComponent,
    PopUpComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    ImageCropperModule,
    ReactiveFormsModule,
    NgxSliderModule,
    CommonModule,
    MatDialogModule,
    AppRoutingModule,
  ],
  entryComponents: [PopUpComponent, ProfileComponent],
  exports: [FormsModule],
  providers: [NgxImageCompressService],
  bootstrap: [AppComponent],
})
export class AppModule {}
