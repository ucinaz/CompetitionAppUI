import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { DOCUMENT } from '@angular/common';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/authentication.service';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    _router: Subscription;
    _url: Router;
    nav: number = 0;

    @ViewChild(NavbarComponent) navbar: NavbarComponent;

    constructor(private authSvc: AuthService, public router: Router, private renderer: Renderer2, @Inject(DOCUMENT,) private document: any, private element: ElementRef, private titleService: Title
    ) {
    }

    ngOnInit() {
        var navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            if (window.outerWidth > 991) {
                window.document.children[0].scrollTop = 0;
            } else {
                window.document.activeElement.scrollTop = 0;
            }
            this.navbar.sidebarClose();
        });

        this.renderer.listen('window', 'scroll', (event) => {
            const number = window.scrollY;
            if (number > 150 || window.pageYOffset > 150) {
                // add logic
                navbar.classList.remove('navbar-transparent');
            } else {
                // remove logic
                navbar.classList.add('navbar-transparent');
            }
        });
        var ua = window.navigator.userAgent;
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            var version = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        if (version) {
            var body = document.getElementsByTagName('body')[0];
            body.classList.add('ie-background');

        }


        // if (this.router.url.indexOf('login') == -1 && this.router.url.indexOf('giris') == -1) {
        //     if (this.authSvc.currentUserSubject.value) {
        //         if (this.tokenExpired(this.authSvc.currentUserSubject.value.jwt_key)) {
        //             this.logout();
        //         }
        //     }
        //     else {
        //         console.log('=== AppComponent > ngOnInit > jwt key YOK logout olunacak');
        //         this.logout();
        //     }
        // }

        // this.router.events
        //     .pipe(
        //         filter((event) => event instanceof NavigationEnd),
        //         map(() => {
        //             let route: ActivatedRoute = this.router.routerState.root;
        //             let routeTitle = '';
        //             while (route!.firstChild) {
        //                 route = route.firstChild;
        //             }
        //             if (route.snapshot.data['title']) {
        //                 routeTitle = route!.snapshot.data['title'];
        //             }
        //             return routeTitle;
        //         })
        //     )
        //     .subscribe((title: string) => {
        //         if (title) {
        //             this.titleService.setTitle(`${title}`);
        //         }
        //     });

    }

    hour: string = '';
    logout() {
        localStorage.removeItem('currentUser');
        this.router.navigateByUrl('/login');
    }

    private tokenExpired(token: string): boolean {
        const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
        return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }

    public formatDate(date: any) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        let hour = d.getHours().toString();
        let minutes = d.getMinutes().toString();
        if (hour.length < 2) hour = '0' + hour;
        if (minutes.length < 2) minutes = '0' + minutes;
        this.hour = hour + ':' + minutes;
        //console.log(hour + ':' + minutes);

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }

}
