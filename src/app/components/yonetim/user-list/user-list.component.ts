import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { serviceResponse } from 'app/models/service-response';
import { ApiService } from 'app/services/api-service.service.';
import { UserList } from 'app/models/user-list.model';

@Component({
  selector: 'app-user-list-liste',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class CompetitorsList implements OnInit {
  loading: boolean = false;
  error: string = '';
  kayitListe: UserList[] = [];
  sorted: UserList[] = [];
  dataPage: number = 1;
  tumKayitlarYuklendi: boolean = false;
  inputArama: string = '';
  inputIlkTarih: Date;
  inputSonTarih: Date;
  // Delayed change
  private aramaChangedSubject: Subject<string> = new Subject<string>();
  private aramaChangedSubscription: Subscription;

  constructor(private webApi: ApiService, private router: Router) {
    this.inputIlkTarih = new Date();
    this.inputSonTarih = new Date();
    this.inputIlkTarih.setDate(this.inputIlkTarih.getDate() - 14);
  }

  ngOnInit(): void {
    this.kayitListesiOku();
  }

  parseDate(event: Event): Date {
    const dateString: string = (event.target as HTMLInputElement).value;
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }

  kayitListesiOku() {
    this.error = '';
    this.loading = true;
    this.webApi.getUsersList(0, this.inputArama, this.dataPage, 90).subscribe(
      {
        next: (apiResponse: serviceResponse<UserList>) => {
          if (apiResponse.success) {
            this.error = '';
            if (this.dataPage === 1) {
              this.kayitListe = apiResponse.data.items;
              this.sorted = this.kayitListe.sort((a, b) => (a.total_point) > (b.total_point) ? -1 : 1);
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

  KayitBul() {
    this.kayitListesiOku();
  }
  inputAramaKeyUp(AramaStr: KeyboardEvent) {
    this.dataPage = 1;
    this.aramaChangedSubject.next(this.inputArama);
  }

}

