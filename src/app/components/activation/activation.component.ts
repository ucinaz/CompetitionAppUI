import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { serviceResponse } from 'app/models/service-response';
import { UserInfo } from 'app/models/userInfo.model';
import { ApiService } from 'app/services/api-service.service.';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {
  loading: boolean = false;
  error: string = '';
  kayitModel = new UserInfo();
  kayitRef: number = 0;
  guid: string = '';

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
    private webApi: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParam) => {
      this.guid = queryParam.guid;
    });
  }

  // get controls(): FormGroup['controls'] {
  //   return this.fgKayit.controls;
  // }

  formToModel() {
    // this.kayitModel.user_id = this.fgKayit.controls.inputuser_id.value ?? 0;
    // this.kayitModel.username = this.fgKayit.controls.inputusername.value ?? '';
    // this.kayitModel.password = this.fgKayit.controls.inputpassword.value ?? '';
    // this.kayitModel.firstName = this.fgKayit.controls.inputfirstName.value ?? '';
    // this.kayitModel.lastName = this.fgKayit.controls.inputlastName.value ?? '';
    // this.kayitModel.email = this.fgKayit.controls.inputemail.value ?? '';
    // this.kayitModel.registerDate = this.fgKayit.controls.inputregisterDate.value ?? '';
    this.kayitModel.activationGUID = this.guid;

  }

  Kaydet(): void {
    console.log('running');
    this.formToModel();
    this.loading = true;
    this.webApi.postUserActivate(this.kayitModel).subscribe(
      {
        next: (apiResponse: serviceResponse<UserInfo>) => {
          if (apiResponse.success) {
            this.kayitRef = apiResponse.data.items[0].user_id;
            Object.assign(this.kayitModel, apiResponse.data.items[0]);

            // Kayıt başarılı mesajı
            Swal.fire({
              icon: 'success',
              position: 'center',
              showConfirmButton: false,
              toast: true,
              title: 'Kaydiniz Tamamlandi. Lutfen Giris Yapin.',
              timer: 4500
            });
            this.router.navigate(['login', {}]);

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