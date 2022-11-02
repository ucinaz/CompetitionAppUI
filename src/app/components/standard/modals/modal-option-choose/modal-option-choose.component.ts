import { Component } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Options } from 'app/models/options.model';
import { serviceResponse } from 'app/models/service-response';
import { ApiService } from 'app/services/api-service.service.';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-option-choose-component',
  templateUrl: './modal-option-choose.component.html',
  styleUrls: ['./modal-option-choose.component.css']
})

export class OptionChooseModalComponent {
  // Delayed change
  private aramaChangedSubject: Subject<string> = new Subject<string>();
  private aramaChangedSubscription: Subscription;


  loading: boolean = false;
  error: string = '';
  kayitListe: Options[] = [];
  dataPage: number = 1;
  tumKayitlarYuklendi: boolean = false;
  inputArama: string = '';
  inputPuan: number = 0;
  closeResult = '';
  kayitModel = new Options();
  kayitRef: number = 0;
  editSelection: string;
  optionSatirList: any;

  constructor(
    public activeModal: NgbActiveModal,
    private webApi: ApiService) { }

  ngOnInit(): void {
    this.kayitListesiOku();
    // EditArama değişimine abone oluyoruz.
    this.aramaChangedSubscription = this.aramaChangedSubject
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.KayitBul();
      });

    this.SearchOptionKeyUp('');
  }

  OptionSearch(arama: string) {
    this.SearchOptionKeyUp(arama);
  }

  SecilenAt(SecilenAt: Options) {
    localStorage.setItem('secilenAt', JSON.stringify(SecilenAt));
    this.activeModal.close('OK');
    //this.closeModal();
    //this.activeModal.dismiss('OK');
  }

  kayitListesiOku() {

    this.error = '';
    this.loading = true;

    this.webApi.getOptionsList(0, this.inputArama, this.dataPage, 15).subscribe(
      {
        next: (apiResponse: serviceResponse<Options>) => {
          if (apiResponse.success) {
            this.error = '';
            if (this.dataPage === 1) {
              this.kayitListe = apiResponse.data.items;
            } else {
              this.kayitListe = this.kayitListe.concat(apiResponse.data.items);
            }
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

  KayitBul() {
    this.kayitListesiOku();
  }

  SonrakiSayfayiYukle() {
    this.dataPage += 1;
    this.kayitListesiOku();
  }

  SearchOptionKeyUp(arama: string) {
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
