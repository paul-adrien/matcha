import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifyComponent } from './verify/verify.component';
import { LoginPageComponent } from './login/login-page.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ForgotPassChangeComponent } from './forgot-pass-change/forgot-pass-change.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './_service/auth.guard';
import { DiscoverComponent } from './discover/discover.component';
import { ProfilCardComponent } from './profil-card/profil-card.component';
import { ProfilMatchComponent } from './profil-match/profil-match.component';
import { TagsComponent } from './tags/tags.component';


const routes: Routes = [
  { path: 'forgotPass/:id', component: ForgotPassChangeComponent },
  { path: 'forgotPass', component: ForgotPassComponent },
  { path: 'verify/:id', component: VerifyComponent },
  { path: '', component: LoginPageComponent },
  { path: 'not-found', component: LoginPageComponent },
  { path: 'home', canActivate: [AuthGuard] , component: HomeComponent, children: [
     { path: 'profile', component: ProfileComponent },
     { path: 'discover', component: DiscoverComponent },
     { path: 'profil-card', component: ProfilCardComponent },
     { path: 'tags', component: TagsComponent },
     { path: 'profil-match/:id', component: ProfilMatchComponent }
] },
  { path: '**', component: LoginPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
