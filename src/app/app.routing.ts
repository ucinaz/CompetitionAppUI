import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { UserInfoKayitComponent } from './components/signup/user-info-kayit.component';
import { MyChoicesComponent } from './components/user/my-choices/my-choices.component';
import { LeaderboardComponent } from './components/user/leaderboard/leaderboard.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';
import { ADMIN_ROUTES } from './components/yonetim/admin.routes';
import { AdminGuardService } from './components/yonetim/admin-guard.service';
import { AdminMainComponent } from './components/yonetim/admin-main.component';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent, data: { title: 'Home - CompetitionApp' } },
  { path: 'login', component: LoginComponent, data: { title: 'Login - CompetitionApp' } },
  { path: 'signup', component: UserInfoKayitComponent, data: { title: 'Sign Up - CompetitionApp' } },
  { path: 'user/my-choices', component: MyChoicesComponent, data: { title: 'My Selections - CompetitionApp' } },
  { path: 'user/leaderboard', component: LeaderboardComponent, data: { title: 'Leaderboard - CompetitionApp' } },
  { path: 'user/home', component: UserHomeComponent, data: { title: 'User Home - CompetitionApp' } },
  { path: 'admin', component: AdminMainComponent, children: ADMIN_ROUTES/*, canActivate: [AdminGuardService]*/ },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
