import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { UserInfo } from 'app/models/userInfo.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserSubject: BehaviorSubject<UserInfo>;
  currentUser: Observable<UserInfo>;

  constructor(
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<UserInfo>(JSON.parse(localStorage.getItem('currentUserYaris') || '{"jwt_key": ""}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  get currentUserValue(): UserInfo {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    var personel1 = new UserInfo();
    personel1.username = username;
    personel1.password = password;
    return this.http.post(environment.api_url + '/api/Auth/login', personel1);
  }

  isAdmin(key: string) {
    return this.http.post(environment.api_url + '/api/authenticate', key);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUserYaris');
    localStorage.removeItem('expirationDate_erp');
    this.currentUserSubject.next(null);
    let url1 = window.location.origin + '/' + '';
    if (environment.base_url != '') url1 = window.location.origin + environment.base_url + '';
    window.location.href = url1;
  }


}
