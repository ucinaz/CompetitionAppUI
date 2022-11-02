import { AdminMainComponent } from './admin-main.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, YonetimRoutes } from '@angular/router';
import { OptionsComponent } from './options/options.component';
import { CompetitorsList } from './user-list/user-list.component';

export const ADMIN_ROUTES: YonetimRoutes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: AdminMainComponent },
    { path: 'options', component: OptionsComponent },
    { path: 'competitors-list', component: CompetitorsList },
]

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(ADMIN_ROUTES, {
            useHash: true
        })
    ],
    exports: [
    ],
})
export class YonetimRotingModule { }