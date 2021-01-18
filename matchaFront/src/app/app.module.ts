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

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    VerifyComponent,
    ForgotPassComponent,
    ForgotPassChangeComponent,
    HomeComponent,
    ProfileComponent,
    NavigationBarComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
