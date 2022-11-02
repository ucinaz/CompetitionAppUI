import { NullTemplateVisitor, ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { serviceResponse } from 'app/models/service-response';
import { UserInfo } from 'app/models/userInfo.model';
import { AuthService } from 'app/services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { ApiService } from 'app/services/api-service.service.';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  //loginForm: FormGroup;
  loading: boolean = false;
  error: string = "";
  returnUrl: string;

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authSvc: AuthService,
    private webApi: ApiService) {
  }

  ngOnInit() {
    localStorage.removeItem('currentUserYaris');
    localStorage.removeItem('secilenAt');
    this.authSvc.currentUser == null;
    this.authSvc.currentUserSubject == null;
    this.authSvc.currentUserValue == null;
  }

  // convenience getter for easy access to form fields
  get f(): FormGroup["controls"] {
    return this.loginForm.controls;
  }

  sendActivationMail(user_id: number) {
    this.error = '';
    this.loading = true;
    this.webApi.sendActivationMail(user_id).subscribe(
      {
        next: (apiResponse: serviceResponse<boolean>) => {
          if (apiResponse.success) {
            /*this.error = '';
            localStorage.setItem('currentUserYaris', JSON.stringify(apiResponse.data.items[0]));
            this.authSvc.currentUserSubject = new BehaviorSubject<UserInfo>(apiResponse.data.items[0]);
            this.authSvc.currentUser = this.authSvc.currentUserSubject.asObservable();

            if (this.authSvc.currentUserValue.userActivated != 1) {
              Swal.fire('Hesabınızı aktif edin.', "Giriş yapabilmek için önce e-posta adresinize gelen linke tıklayarak hesabınızı aktif etmeniz gerekmektedir. E-Posta yeniden gonderilmistir.", 'error');
              this.webApi.sendActivationMail(this.authSvc.currentUserValue.user_id);
              setTimeout(function () { return this.router.navigate(['/login']); }, 6000);
            }

            if (this.authSvc.currentUserValue.contestRegistered == 0 && this.authSvc.currentUserValue.userActivated == 1) {
              this.router.navigate(['user/register']);
            } else if (this.authSvc.currentUserValue.contestRegistered == 1 && this.authSvc.currentUserValue.userActivated == 1) {
              this.router.navigate(['user/my-choices']);
            }*/
          }
          else {
            this.error = apiResponse.message;
            Swal.fire('Hata oluştu!', this.error, 'error');
          }
          this.loading = false;
        },
        error: error => {
          this.error = 'WebApi bağlantı hatası: ' + error.message;
          //Swal.fire('Hata oluştu!', this.error, 'error');
          this.loading = false;
        },
        complete: () => {
        }
      });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.error = 'Geçersiz veri girildi.';
      return;
    }

    this.error = '';
    this.loading = true;
    this.authSvc.login(this.f.username.value, this.f.password.value).subscribe(
      {
        next: (apiResponse: serviceResponse<UserInfo>) => {
          if (apiResponse.success) {
            this.error = '';
            localStorage.setItem('currentUserYaris', JSON.stringify(apiResponse.data.items[0]));
            this.authSvc.currentUserSubject = new BehaviorSubject<UserInfo>(apiResponse.data.items[0]);
            this.authSvc.currentUser = this.authSvc.currentUserSubject.asObservable();
            this.webApi.createServiceHeader(apiResponse.data.items[0].jwt_key);

            if (this.authSvc.currentUserValue.userActivated != 1) {
              Swal.fire('Hesabınızı aktif edin.', "Giriş yapabilmek için önce e-posta adresinize gelen linke tıklayarak hesabınızı aktif etmeniz gerekmektedir. E-Posta yeniden gonderilmistir. Eğer e-posta ulaşmadıysa, lütfen Gereksiz E-Postalar (SPAM) klasörünü kontrol edin.", 'error');
              this.sendActivationMail(this.authSvc.currentUserValue.user_id);
              setTimeout(function () { return this.router.navigate(['/login']); }, 6000);
            } else {
              this.router.navigate(['user/home']);
              // if (this.authSvc.currentUserValue.contestRegistered == 0 && this.authSvc.currentUserValue.userActivated == 1) {
              //   this.router.navigate(['user/home']);
              // } else if (this.authSvc.currentUserValue.contestRegistered == 1 && this.authSvc.currentUserValue.userActivated == 1) {
              //   this.router.navigate(['user/home']);
              // }
            }

            if (this.authSvc.currentUserValue.isAdmin == 1) {
              this.router.navigate(['yonetim/options']);
            }
          }
          else {
            this.error = apiResponse.message;
            Swal.fire('Hata oluştu!', this.error, 'error');
          }
          this.loading = false;
        },
        error: error => {
          this.error = 'WebApi bağlantı hatası: ' + error.message;
          //Swal.fire('Hata oluştu!', this.error, 'error');
          this.loading = false;
        },
        complete: () => {
        }
      });
  }

}
