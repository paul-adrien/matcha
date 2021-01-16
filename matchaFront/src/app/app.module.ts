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

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    VerifyComponent,
    ForgotPassComponent,
    ForgotPassChangeComponent,
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
