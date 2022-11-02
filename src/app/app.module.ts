import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http'
import { OptionChooseComponent } from './components/user/register/option-choose.component';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UserInfoKayitComponent } from './components/signup/user-info-kayit.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoginComponent } from './components/login/login.component';
import { OptionChooseModalComponent } from './components/standard/modals/modal-option-choose/modal-option-choose.component';
import { MyChoicesComponent } from './components/user/my-choices/my-choices.component';
import { ActivationComponent } from './components/activation/activation.component';
import { UserNavbarComponent } from './components/user/user-navbar/user-navbar.component';
import { UserComponent } from './components/user/user-main.component';
import { UserRoutingModule } from './components/user/user.routes';
import { LandingComponent } from './components/landing/landing.component';
import { LeaderboardComponent } from './components/user/leaderboard/leaderboard.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';
import { AdminMainComponent } from './components/yonetim/admin-main.component';
import { AdminNavComponent } from './components/yonetim/shared/admin-nav/admin-nav.component';
import { OptionsComponent } from './components/yonetim/options/options.component';
import { CompetitorsList } from './components/yonetim/user-list/user-list.component';
import { AdminGuardService } from './components/yonetim/admin-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    UserInfoKayitComponent,
    OptionChooseComponent,
    LoginComponent,
    OptionChooseModalComponent,
    MyChoicesComponent,
    ActivationComponent,
    UserNavbarComponent,
    UserComponent,
    LandingComponent,
    LeaderboardComponent,
    UserHomeComponent,
    AdminMainComponent,
    AdminNavComponent,
    OptionsComponent,
    CompetitorsList
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    UserRoutingModule,
    NgSelectModule
  ],
  entryComponents: [OptionChooseModalComponent],
  providers: [AdminGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
