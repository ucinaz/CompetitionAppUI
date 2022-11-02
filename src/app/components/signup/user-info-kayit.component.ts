import { Component, OnInit, SimpleChanges } from '@angular/core';
import { environment } from 'environments/environment';
import { FormGroup, FormsModule, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UserInfo } from 'app/models/userInfo.model';
import Swal from 'sweetalert2';
import { AppComponent } from 'app/app.component';
import { ApiService } from 'app/services/api-service.service.';
import { serviceResponse } from 'app/models/service-response';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-info-kayit',
    templateUrl: './user-info-kayit.component.html',
    styleUrls: ['./user-info-kayit.component.css']
})

export class UserInfoKayitComponent implements OnInit {
    loading: boolean = false;
    error: string = '';
    kayitModel = new UserInfo();
    kayitRef: number = 0;
    isnum = false;

    fgKayit = new FormGroup({
        inputuser_id: new FormControl(),
        inputusername: new FormControl(),
        inputpassword: new FormControl(),
        inputfirstName: new FormControl(),
        inputlastName: new FormControl(),
        inputemail: new FormControl(),
        inputregisterDate: new FormControl(),
    })

    constructor(
        private _location: Location,
        private app: AppComponent,
        private webApi: ApiService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        if (localStorage.getItem('currentUserYaris')) {
            this.kayitRef = Number(localStorage.getItem('currentUserYaris'));
            if (this.kayitRef > 0) { this.kayitListesiOku(); }
            localStorage.removeItem('currentUserYaris');
        }
        localStorage.removeItem('currentUserYaris');

    }

    get controls(): FormGroup['controls'] {
        return this.fgKayit.controls;
    }

    isNumeric($event) {
        var matches = $event.match(/\d+/g);
        if (matches != null) {
            this.isnum = true;
        }
    }

    modelToForm() {
        // this.fgKayit.patchValue(kayitModel); // Toplu istersek
        this.fgKayit.controls.inputuser_id.setValue(this.kayitModel.user_id);
        this.fgKayit.controls.inputusername.setValue(this.kayitModel.username);
        this.fgKayit.controls.inputpassword.setValue(this.kayitModel.password);
        this.fgKayit.controls.inputfirstName.setValue(this.kayitModel.firstName);
        this.fgKayit.controls.inputlastName.setValue(this.kayitModel.lastName);
        this.fgKayit.controls.inputemail.setValue(this.kayitModel.email);
        this.fgKayit.controls.inputregisterDate.setValue(this.kayitModel.registerDate);
    }

    formToModel() {
        this.kayitModel.user_id = this.fgKayit.controls.inputuser_id.value ?? 0;
        this.kayitModel.username = this.fgKayit.controls.inputusername.value ?? '';
        this.kayitModel.password = this.fgKayit.controls.inputpassword.value ?? '';
        this.kayitModel.firstName = this.fgKayit.controls.inputfirstName.value ?? '';
        this.kayitModel.lastName = this.fgKayit.controls.inputlastName.value ?? '';
        this.kayitModel.email = this.fgKayit.controls.inputemail.value ?? '';
        // this.kayitModel.registerDate = this.fgKayit.controls.inputregisterDate.value;
    }

    kayitListesiOku() {
        this.error = '';
        this.loading = true;
        this.webApi.getUserList(this.kayitRef, '', 1, 1).subscribe(
            {
                next: (apiResponse: serviceResponse<UserInfo>) => {
                    if (apiResponse.success) {
                        this.error = '';
                        Object.assign(this.kayitModel, apiResponse.data.items[0]);
                    } else {
                        this.error = apiResponse.message;
                    }
                    this.loading = false;
                },
                error: error => {
                    this.error = 'WebApi bağlantı hatası: ' + error.message;
                    Swal.fire('Hata oluştu!', this.error, 'error');
                    this.loading = false;
                },
                complete: () => {
                }
            });
    }

    Kaydet(): void {
        console.log('running');
        this.formToModel();
        this.loading = true;
        this.webApi.postUserRegister(this.kayitModel).subscribe(
            {
                next: (apiResponse: serviceResponse<UserInfo>) => {
                    if (apiResponse.success) {
                        this.kayitRef = apiResponse.data.items[0].user_id;
                        this.kayitModel.user_id = this.kayitRef;

                        localStorage.setItem('currentUserYaris', JSON.stringify(apiResponse.data.items[0]));

                        // Kayıt başarılı mesajı
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Kaydınız neredeyse tamam',
                            text: 'Lütfen e-posta adresinize gelen linke tıklayarak kaydınızı tamamlayın. Eğer e-posta ulaşmadıysa, lütfen Gereksiz E-Postalar (SPAM) klasörünü kontrol edin.',
                            showConfirmButton: true,
                        });

                        setTimeout(() => this.router.navigate(['/login']), 6000);

                    } else {
                        Swal.fire('Hata oluştu!', apiResponse.message, 'error');
                        this.error = apiResponse.message;
                    }
                    this.loading = false;
                },
                error: error => {
                    this.error = 'WebApi bağlantı hatası: ' + error.message;
                    Swal.fire('Hata oluştu!', this.error, 'error');
                    this.loading = false;
                },
                complete: () => {
                }
            });
    }
}