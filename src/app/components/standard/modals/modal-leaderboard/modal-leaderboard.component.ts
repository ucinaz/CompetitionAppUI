import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Options } from 'app/models/options.model';
import { serviceResponse } from 'app/models/service-response';
import { ApiService } from 'app/services/api-service.service.';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { userSelections } from 'app/models/userSelections.model';

@Component({
  selector: 'app-modal-leaderboard-component',
  templateUrl: './modal-leaderboard.component.html',
  styleUrls: ['./modal-leaderboard.component.css']
})
export class ModalLeaderboard {
  loading: boolean = false;
  error: string = '';
  kayitListe: userSelections[] = [];
  closeResult = '';
  kayitModel = new userSelections();
  kayitRef = Number(localStorage.getItem('secilenUser'));
  optionSatirList: any;

  constructor(
    public activeModal: NgbActiveModal,
    private webApi: ApiService) { }

  ngOnInit(): void {
    this.kayitListesiOku();
    // EditArama değişimine abone oluyoruz.
  }



  SecilenAt(SecilenAt: Options) {
    localStorage.setItem('secilenAt', JSON.stringify(SecilenAt));
    this.activeModal.close('OK');
  }

  kayitListesiOku() {
    this.error = '';
    this.loading = true;
    this.webApi.getUserSelectionList(this.kayitRef, '', 1, 50).subscribe(
      {
        next: (apiResponse: serviceResponse<userSelections>) => {
          if (apiResponse.success) {
            this.error = '';
            Object.assign(this.kayitModel, apiResponse.data.items[0]);
          }
          else {
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
          //console.info('complete') 
        }
      });
  }

  SearchSelectionKeyUp(arama: string) {
    this.error = 'YÜKLENİYOR!';
    this.loading = true;
    this.webApi.OptionSatirList(0, 0, arama).subscribe({
      next: (apiResponse: serviceResponse<Options>) => {
        if (apiResponse.success) {
          this.error = '';
          this.optionSatirList = apiResponse.data.items;
        }
        else {
          this.error = apiResponse.message;
        }
        this.loading = false;
      },
      error: error => {
        this.error = 'WebApi bağlantı hatası: ' + error.message;
        this.loading = false;
      }
    });
  }


}
