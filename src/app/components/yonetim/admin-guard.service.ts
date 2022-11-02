import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { ApiService } from "app/services/api-service.service.";
import { AuthService } from "app/services/authentication.service";
import { Observable } from "rxjs";
@Injectable()
export class AdminGuardService implements CanActivate {
    constructor(private router: Router, private webApi: ApiService, private authSvc: AuthService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // if (this.authSvc.currentUserValue.isAdmin == 1) {
        //     return true;
        // } else {
        //     this.router.navigate(['/login']);
        // }
        return true;
    }
}