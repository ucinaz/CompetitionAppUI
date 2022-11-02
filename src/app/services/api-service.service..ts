import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { UserInfo } from 'app/models/userInfo.model';
import { serviceResponse } from 'app/models/service-response';
import { userSelections } from 'app/models/userSelections.model';
import { Options } from 'app/models/options.model';
import { AuthService } from './authentication.service';
import { UserList } from 'app/models/user-list.model';

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    header: HttpHeaders;

    constructor(
        private http: HttpClient,
        private authSvc: AuthService) {
        this.createServiceHeader(this.authSvc.currentUserSubject.value.jwt_key);
    }


    errorHandler(error: Response) {
        console.log('hatakodu = ' + error);
        return throwError(error);
    }

    createServiceHeader(aJwtKey: string) {
        //if (this.header != null) this.header
        this.header = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + aJwtKey
        });
    }

    // getOptionsList(stok_ref, arama: string, page: number, pageSize: number) {
    //     let parametre: string = '';
    //     if (page != null) parametre += '&page=' + page;
    //     if (pageSize != null) parametre += '&pageSize=' + pageSize;
    //     if (stok_ref != null) parametre += '&stok_ref=' + stok_ref;
    //     if (arama != null) parametre += '&arama=' + arama;
    //     if (parametre != '') parametre = '?' + parametre.substr(1);
    //     return this.http.get(environment.api_url + '/api/options-liste' + parametre, { headers: this.header });
    // }

    getUserList(kayitRef: number, arama: string, page: number, pageSize: number) {
        let parametre: string = '';
        if (kayitRef != null) { parametre += '&kayitRef=' + kayitRef; }
        if (arama != null && arama !== '') { parametre += '&arama=' + arama; }
        if (page != null) { parametre += '&page=' + page; }
        if (pageSize != null) { parametre += '&pageSize=' + pageSize; }
        if (parametre !== '') { parametre = '?' + parametre.substr(1); }
        // tslint:disable-next-line:max-line-length
        return this.http.get<serviceResponse<UserInfo>>(environment.api_url + '/api/user-liste' + parametre, { headers: this.header });
    }

    postUserRegister(AModel: UserInfo) {
        return this.http.post<serviceResponse<UserInfo>>(environment.api_url + '/api/user-kayit', AModel, {});
    }

    postUserActivate(AModel: UserInfo) {
        return this.http.post<serviceResponse<UserInfo>>(environment.api_url + '/api/user-activate', AModel, {});
    }

    sendActivationMail(user_id: number) {
        var userid = user_id
        return this.http.get<serviceResponse<boolean>>(environment.api_url + '/api/send-activation-email?aUserId=' + userid.toString() + '&hataUret=false', {});
    }

    deleteUser(kayitRef: number) {
        let parametre: string = '';
        if (kayitRef != null) { parametre += '&kayitRef=' + kayitRef; }
        if (parametre !== '') { parametre = '?' + parametre.substr(1); }
        return this.http.get<serviceResponse<UserInfo>>(environment.api_url + '/api/user-sil' + parametre, { headers: this.header })
    }

    OptionSatirList(pplan_ref, pplan_satir_ref, arama) {
        pplan_ref = 0
        return this.http.get(environment.api_url + '/api/option-liste?id=' + pplan_ref + '&pplan_satir_ref=' + pplan_satir_ref + '&arama=' + arama, { headers: this.header });
    }

    getRegisterList(kayitRef: number, userId: number, arama: string, page: number, pageSize: number) {
        let parametre: string = '';
        if (kayitRef != null) { parametre += '&kayitRef=' + kayitRef; }
        if (userId != null) { parametre += '&userId=' + userId; }
        if (arama != null && arama !== '') { parametre += '&arama=' + arama; }
        if (page != null) { parametre += '&page=' + page; }
        if (pageSize != null) { parametre += '&pageSize=' + pageSize; }
        if (parametre !== '') { parametre = '?' + parametre.substr(1); }
        return this.http.get<serviceResponse<userSelections>>(environment.api_url + '/api/horse-chosen-liste' + parametre);
    }

    postCompetitionRegister(AModel: userSelections) {
        return this.http.post<serviceResponse<userSelections>>(environment.api_url + '/api/option-chosen-kayit', AModel, { headers: this.header });
    }

    deleteRegister(kayitRef: number) {
        let parametre: string = '';
        if (kayitRef != null) { parametre += '&kayitRef=' + kayitRef; }
        if (parametre !== '') { parametre = '?' + parametre.substr(1); }
        return this.http.get<serviceResponse<userSelections>>(environment.api_url + '/api/register-sil' + parametre, { headers: this.header })
    }

    getOptionsList(kayitRef: number, arama: string, page: number, pageSize: number) {
        let parametre: string = '';
        if (kayitRef != null) { parametre += '&kayitRef=' + kayitRef; }
        if (arama != null && arama !== '') { parametre += '&arama=' + arama; }
        if (page != null) { parametre += '&page=' + page; }
        if (pageSize != null) { parametre += '&pageSize=' + pageSize; }
        if (parametre !== '') { parametre = '?' + parametre.substr(1); }
        return this.http.get<serviceResponse<Options>>(environment.api_url + '/api/option-liste' + parametre)
    }

    postOptionsKayit(AModel: Options) {
        return this.http.post<serviceResponse<Options>>(environment.api_url + '/api/options-kayit', AModel, { headers: this.header });
    }

    deleteOptions(kayitRef: number) {
        let parametre: string = '';
        if (kayitRef != null) { parametre += '&kayitRef=' + kayitRef; }
        if (parametre !== '') { parametre = '?' + parametre.substr(1); }
        return this.http.get<serviceResponse<Options>>(environment.api_url + '/api/option-sil' + parametre, {})
    }

    login(username: string, password: string) {
        return this.http.post(environment.api_url + { headers: this.header }, { username, password });
    }

    getUserSelectionList(kayitRef: number, arama: string, page: number, pageSize: number) {
        let parametre: string = '';
        if (kayitRef != null) parametre += '&kayitRef=' + kayitRef;
        if (arama != null && arama != '') parametre += '&arama=' + arama;
        if (page != null) parametre += '&page=' + page;
        if (pageSize != null) parametre += '&pageSize=' + pageSize;
        if (parametre != '') parametre = '?' + parametre.substr(1);
        return this.http.get<serviceResponse<userSelections>>(environment.api_url + '/api/horse-chosen-liste' + parametre, { headers: this.header })
    }

    getUsersList(kayitRef: number, arama: string, page: number, pageSize: number) {
        let parametre: string = '';
        if (kayitRef != null) parametre += '&kayitRef=' + kayitRef;
        if (arama != null && arama != '') parametre += '&arama=' + arama;
        if (page != null) parametre += '&page=' + page;
        if (pageSize != null) parametre += '&pageSize=' + pageSize;
        if (parametre != '') parametre = '?' + parametre.substr(1);
        return this.http.get<serviceResponse<UserList>>(environment.api_url + '/api/user-list-liste' + parametre, { headers: this.header })
    }
} 
