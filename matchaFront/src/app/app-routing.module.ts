import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifyComponent } from './verify/verify.component';
import { LoginPageComponent } from './login/login-page.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ForgotPassChangeComponent } from './forgot-pass-change/forgot-pass-change.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './_service/auth.guard';


const routes: Routes = [
  { path: 'forgotPass/:id', component: ForgotPassChangeComponent },
  { path: 'forgotPass', component: ForgotPassComponent },
  { path: 'verify/:id', component: VerifyComponent },
  { path: '', component: LoginPageComponent },
  { path: 'not-found', component: LoginPageComponent },
  //{ path: '**', component: LoginPageComponent },
  { path: 'home', canActivate: [AuthGuard] , component: HomeComponent, children: [
     { path: 'profile', component: ProfileComponent }
] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
