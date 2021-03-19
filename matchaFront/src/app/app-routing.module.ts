import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { VerifyComponent } from "./verify/verify.component";
import { LoginPageComponent } from "./login/login-page.component";
import { ForgotPassComponent } from "./forgot-pass/forgot-pass.component";
import { ForgotPassChangeComponent } from "./forgot-pass-change/forgot-pass-change.component";
import { HomeComponent } from "./home/home.component";
import { ProfileComponent } from "./profile/profile.component";
import { AuthGuard } from "./_service/auth.guard";
import { DiscoverComponent } from "./discover/discover.component";
import { ProfilCardComponent } from "./profil-card/profil-card.component";
import { TagsComponent } from "./tags/tags.component";
import { FilterAndSortComponent } from "./filter-and-sort/filter-and-sort.component";
import { HomeMessagingComponent } from "./home-messaging/home-messaging.component";
import { ProfileViewComponent } from "./profile-view/profile-view.component";
import { NotificationComponent } from "./notification/notification.component";
import { DiscussionComponent } from "./discussion/discussion.component";
import { MaintenanceComponent } from "./maintenance/maintenance.component";
import { InteractiveMapComponent } from "./interactive-map/interactive-map.component";

const routes: Routes = [
  { path: "login", component: LoginPageComponent },
  { path: "forgotPass/:id", component: ForgotPassChangeComponent },
  { path: "forgotPass", component: ForgotPassComponent },
  { path: "verify/:id", component: VerifyComponent },
  { path: "not-found", component: LoginPageComponent },
  { path: "maintenance", component: MaintenanceComponent },
  {
    path: "home",
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      { path: "profile", canActivate: [AuthGuard], component: ProfileComponent },
      { path: "discover", canActivate: [AuthGuard], component: DiscoverComponent },
      { path: "profil-card", canActivate: [AuthGuard], component: ProfilCardComponent },
      { path: "tags", canActivate: [AuthGuard], component: TagsComponent },
      { path: "suggestion", canActivate: [AuthGuard], component: FilterAndSortComponent },
      { path: "profile-view/:id", canActivate: [AuthGuard], component: ProfileViewComponent },
      { path: "messaging", canActivate: [AuthGuard], component: HomeMessagingComponent },
      { path: "discussion/:id/:convId", canActivate: [AuthGuard], component: DiscussionComponent },
      { path: "notif", canActivate: [AuthGuard], component: NotificationComponent },
      { path: "map", canActivate: [AuthGuard], component: InteractiveMapComponent },
    ],
  },
  {
    path: "",
    redirectTo: "/home/discover",
    canActivate: [AuthGuard],
    pathMatch: "full",
  },
  { path: "**", redirectTo: "/home/discover",
  canActivate: [AuthGuard],
  pathMatch: "full", },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
