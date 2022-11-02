import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { serviceResponse } from 'app/models/service-response';
import { ApiService } from 'app/services/api-service.service.';
import { Options } from 'app/models/options.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-options-liste',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  loading: boolean = false;
  error: string = '';
  kayitListe: Options[] = [];
  dataPage: number = 1;
  tumKayitlarYuklendi: boolean = false;
  inputArama: string = '';
  inputPuan: number = 0;
  new_name: string = '';

  closeResult = '';
  kayitModel = new Options();
  kayitRef: number = 0;


  puanKayit = new FormGroup({
    eklenenpuan: new FormControl(),
    inputid: new FormControl(),
    inputoption_name: new FormControl(),
    inputoption_family: new FormControl()
  });

  // Delayed change
  private aramaChangedSubject: Subject<string> = new Subject<string>();
  private aramaChangedSubscription: Subscription;

  constructor(
    private webApi: ApiService,
    private router: Router,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
      this.kayitListesiOku();
    // EditArama değişimine abone oluyoruz.
    this.aramaChangedSubscription = this.aramaChangedSubject
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.KayitBul();
      });
  }

  get controls(): FormGroup['controls'] {
    return this.puanKayit.controls;
  }

  formToModel() {
    this.kayitModel.option_point = this.puanKayit.controls.eklenenpuan.value;
    this.kayitModel.id = this.puanKayit.controls.inputid.value;
    this.kayitModel.option_name = this.puanKayit.controls.inputoption_name.value;
  }

  modelToForm() {
    this.puanKayit.controls.inputid.setValue(this.kayitModel.id);
    this.puanKayit.controls.inputoption_name.setValue(this.kayitModel.option_name);
  }

  parseDate(event: Event): Date {
    const dateString: string = (event.target as HTMLInputElement).value;
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }

  kayitListesiOku() {
    // let ilkTarihStr: string = '';
    // let sonTarihStr: string = '';
    this.error = '';
    this.loading = true;
    // if (this.inputIlkTarih !== undefined) { ilkTarihStr = this.inputIlkTarih.toISOString().substring(0, 10); }
    // if (this.inputSonTarih !== undefined) { sonTarihStr = this.inputSonTarih.toISOString().substring(0, 10); }
    this.webApi.getOptionsList(0, this.inputArama, this.dataPage, 50).subscribe(
      {
        next: (apiResponse: serviceResponse<Options>) => {
          if (apiResponse.success) {
            this.error = '';
            if (this.dataPage === 1) {
              this.kayitListe = apiResponse.data.items;
            } else {
              this.kayitListe = this.kayitListe.concat(apiResponse.data.items);
              this.modelToForm();
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

  KayitEkle() {
    this.KayitDuzenle(0);
  }

  KayitDuzenle(kayitRef: number) {
    localStorage.setItem('optionsRef', kayitRef.toString());
    this.router.navigate(['/options-kayit']);
  }

  KayitSil(kayitRef: number) {
    // Swal.fire('Dikkat', 'Kayıt silme hazır değil. (Ref = ' + kayitRef + ')', 'info');
    Swal.fire({
      title: 'options silme',
      text: 'Bu options silinecektir!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Vazgeç',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'optionsyi sil!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.webApi.deleteOptions(kayitRef).subscribe((apiResponse: serviceResponse<Options>) => {
          if (apiResponse.success) {
            this.kayitListesiOku();
            Swal.fire(
              'options silindi!',
              'options silindi',
              'success'
            )
          }
        },
          error => {
            this.error = 'WebApi bağlantı hatası: ' + error.message;
            this.loading = false;
          });
      }
    })
  }

  KayitYazdir(kayitRef: number) {
    localStorage.setItem('FirmaRef', kayitRef.toString());
    this.router.navigate(['/firma-analiz']);
  }

  inputAramaKeyUp(AramaStr: KeyboardEvent) {
    this.dataPage = 1;
    this.aramaChangedSubject.next(this.inputArama);
  }

  SonrakiSayfayiYukle() {
    this.dataPage += 1;
    this.kayitListesiOku();
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  PuanEkle(Aoption: Options) {
    this.formToModel();

    // console.log('burdayim :')
    // console.table(this.kayitModel);

    this.loading = true;
    if (!this.inputPuan) {
      Swal.fire('Hata', 'Geçerli bir puan giriniz!', 'info')
      return;
    }
    // tslint:disable-next-line:radix
    Aoption.option_point = Aoption.option_point + parseInt(this.inputPuan.toString());
    this.webApi.postOptionsKayit(Aoption).subscribe(
      {
        next: (apiResponse: serviceResponse<Options>) => {
          if (apiResponse.success) {
            this.kayitRef = apiResponse.data.items[0].id;
            this.kayitModel.id = this.kayitRef;

            // Kayıt başarılı mesajı
            Swal.fire({
              toast: true,
              position: 'center',
              icon: 'success',
              title: 'Puan eklendi.',
              showConfirmButton: false,
              timer: 1500
            });
            // this.Geri();
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
          // console.info('complete')
        }
      });
  }

  AdDuzenle(Aoption: Options) {
    this.formToModel();

    this.loading = true;
    if (!this.new_name) {
      Swal.fire('Hata', 'Geçerli bir ad giriniz!', 'info')
      return;
    }

    Aoption.option_name = this.new_name;

    // tslint:disable-next-line:radix
    this.webApi.postOptionsKayit(Aoption).subscribe(
      {
        next: (apiResponse: serviceResponse<Options>) => {
          if (apiResponse.success) {
            this.kayitRef = apiResponse.data.items[0].id;
            this.kayitModel.id = this.kayitRef;

            // Kayıt başarılı mesajı
            Swal.fire({
              toast: true,
              position: 'center',
              icon: 'success',
              title: 'Ad duzenlendi.',
              showConfirmButton: false,
              timer: 1500
            });
            // this.Geri();
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
          // console.info('complete')
        }
      });

  }
}