import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from 'app/services/api-service.service.';
import { serviceResponse } from 'app/models/service-response';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { userSelections } from 'app/models/userSelections.model';
import { Options } from 'app/models/options.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { OptionChooseModalComponent } from 'app/components/standard/modals/modal-option-choose/modal-option-choose.component';
import { AuthService } from 'app/services/authentication.service';

@Component({
  selector: 'app-my-choices',
  templateUrl: './my-choices.component.html',
  styleUrls: ['./my-choices.component.css']
})
export class MyChoicesComponent implements OnInit {
  loading: boolean = false;
  error: string = '';
  kayitRef: number = 0;
  kayitModel = new userSelections();
  kayitListe: Options[] = [];
  dataPage: number = 1;
  tumKayitlarYuklendi: boolean = false;
  public selectControl = new FormControl();
  selectedOption: number;
  optionSatirlist: any;
  closeResult = '';
  optionNames: {} = {};

  fgKayit = new FormGroup({
    inputid: new FormControl(),
    inputuser_id: new FormControl(),
    inputfirstName: new FormControl(),
    inputlastName: new FormControl(),
    inputselection_1_name: new FormControl(),
    inputselection_2_name: new FormControl(),
    inputselection_3_name: new FormControl(),
    inputselection_4_name: new FormControl(),
    inputselection_5_name: new FormControl(),
    inputselection_6_name: new FormControl(),
    inputselection_7_name: new FormControl(),
    inputselection_8_name: new FormControl(),
    inputselection_9_name: new FormControl(),
    inputselection_10_name: new FormControl(),
    inputactivationConfirm: new FormControl()
  })

  // Delayed change
  private aramaChangedSubject: Subject<string> = new Subject<string>();
  private aramaChangedSubscription: Subscription;

  constructor(
    private _location: Location,
    private authSvc: AuthService,
    private webApi: ApiService,
    private router: Router,
    private modalService: NgbModal) {
    //
  }

  ngOnInit(): void {
    this.kayitListesiOku();

    if (this.authSvc.currentUserValue.contestRegistered == 0 && this.authSvc.currentUserValue.userActivated == 1) {
      this.router.navigate(['user/register']);
    } else if (this.authSvc.currentUserValue.contestRegistered == 0 && this.authSvc.currentUserValue.userActivated == 0) {
      this.router.navigate(['login']);
    }

    if (this.authSvc.currentUserValue.username == null) {
      this.router.navigate(['/login']);
    }
  }

  get controls(): FormGroup['controls'] {
    return this.fgKayit.controls;
  }


  modelToForm() {
    this.fgKayit.controls.inputselection_1_name.setValue(this.kayitModel.selection_1_name);
    this.fgKayit.controls.inputselection_2_name.setValue(this.kayitModel.selection_2_name);
    this.fgKayit.controls.inputselection_3_name.setValue(this.kayitModel.selection_3_name);
    this.fgKayit.controls.inputselection_4_name.setValue(this.kayitModel.selection_4_name);
    this.fgKayit.controls.inputselection_5_name.setValue(this.kayitModel.selection_5_name);
    this.fgKayit.controls.inputselection_6_name.setValue(this.kayitModel.selection_6_name);
    this.fgKayit.controls.inputselection_7_name.setValue(this.kayitModel.selection_7_name);
    this.fgKayit.controls.inputselection_8_name.setValue(this.kayitModel.selection_8_name);
    this.fgKayit.controls.inputselection_9_name.setValue(this.kayitModel.selection_9_name);
    this.fgKayit.controls.inputselection_10_name.setValue(this.kayitModel.selection_10_name);
  }


  kayitListesiOku() {
    this.error = '';
    this.loading = true;
    this.webApi.getRegisterList(this.kayitRef, this.authSvc.currentUserValue.user_id, '', 1, 1).subscribe(
      {
        next: (apiResponse: serviceResponse<userSelections>) => {
          if (apiResponse.success) {
            this.error = '';
            if (apiResponse.data.items.length > 0) {
              Object.assign(this.kayitModel, apiResponse.data.items[0]);
              this.kayitRef = this.kayitModel.id;
              this.modelToForm();
            }
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
          // console.info('complete')
        }
      });
  }



  getOptionsList() {

    this.error = '';
    this.loading = true;
    this.webApi.getOptionsList(this.kayitRef, '', 1, 1).subscribe(
      {
        next: (apiResponse: serviceResponse<Options>) => {
          if (apiResponse.success) {
            this.error = '';
            if (this.dataPage === 1) {
              this.kayitListe = apiResponse.data.items;
            } else { this.kayitListe = this.kayitListe.concat(apiResponse.data.items); }
            if (((apiResponse.data.page - 1) * apiResponse.data.pageSize) + apiResponse.data.itemCount >= apiResponse.data.totalItemCount) {
              this.tumKayitlarYuklendi = true;
            } else { this.tumKayitlarYuklendi = false; }
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
          // console.info('complete')
        }
      });
  }



}
