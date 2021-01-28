import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login/login-page.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { VerifyComponent } from './verify/verify.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ForgotPassChangeComponent } from './forgot-pass-change/forgot-pass-change.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { NavigationBarComponent } from './nav-bar/nav-bar.component';
import { DiscoverComponent } from './discover/discover.component';
import { ProfilCardComponent } from './profil-card/profil-card.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ProfilMatchComponent } from './profil-match/profil-match.component';
import { TagsComponent } from './tags/tags.component';


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
    ProfilMatchComponent,
    TagsComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ImageCropperModule
  ],
  exports: [FormsModule],
  providers: [NgxImageCompressService],
  bootstrap: [AppComponent]
})
export class AppModule { }
