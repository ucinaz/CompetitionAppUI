import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OptionChooseComponent } from './register/option-choose.component';
import { UserInfoKayitComponent } from '../signup/user-info-kayit.component';

export const USER_ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', component: OptionChooseComponent },
    { path: 'signup', component: UserInfoKayitComponent }
]

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(USER_ROUTES, {
            useHash: true
        })
    ],
    exports: [
    ],
})
export class UserRoutingModule { }