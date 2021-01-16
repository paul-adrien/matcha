import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifyComponent } from './verify/verify.component';
import { LoginPageComponent } from './login/login-page.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ForgotPassChangeComponent } from './forgot-pass-change/forgot-pass-change.component';


const routes: Routes = [
  { path: 'forgotPass/:id', component: ForgotPassChangeComponent },
  { path: 'forgotPass', component: ForgotPassComponent },
  { path: 'verify/:id', component: VerifyComponent },
  { path: '', component: LoginPageComponent },
  { path: 'not-found', component: LoginPageComponent },
  { path: '**', component: LoginPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
