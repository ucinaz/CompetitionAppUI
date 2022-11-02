import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { serviceResponse } from 'app/models/service-response';
import { ApiService } from 'app/services/api-service.service.';
import { userSelections } from 'app/models/userSelections.model';
import { ModalLeaderboard } from '../../standard/modals/modal-leaderboard/modal-leaderboard.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/services/authentication.service';

@Component({
  selector: 'app-leaderboard-component',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  loading: boolean = false;
  error: string = '';
  kayitListe: userSelections[] = [];
  sorted: userSelections[] = [];
  dataPage: number = 1;
  tumKayitlarYuklendi: boolean = false;
  inputArama: string = '';
  inputIlkTarih: Date;
  inputSonTarih: Date;


  constructor(private webApi: ApiService, private router: Router, private modalService: NgbModal, private authSvc: AuthService) {

  }

  ngOnInit(): void {
    this.kayitListesiOku();

    localStorage.removeItem('secilenAt');
    if (this.authSvc.currentUserValue == null) {
      this.router.navigate(['/login']);
    }

    if (this.authSvc.currentUserValue.userActivated != 1) {
      this.router.navigate(['/login']);
    }

    if (this.authSvc.currentUserSubject == null) {
      this.router.navigate(['/login']);
    }
  }

  kayitListesiOku() {

    this.error = '';
    this.loading = true;

    this.webApi.getUserSelectionList(0, this.inputArama, this.dataPage, 90).subscribe(
      {
        next: (apiResponse: serviceResponse<userSelections>) => {
          if (apiResponse.success) {
            this.error = '';
            if (this.dataPage == 1) {
              this.kayitListe = apiResponse.data.items;
              this.sorted = this.kayitListe.sort((a, b) => (a.total_point) > (b.total_point) ? -1 : 1);
            } else this.kayitListe = this.kayitListe.concat(apiResponse.data.items);
            if (((apiResponse.data.page - 1) * apiResponse.data.pageSize) + apiResponse.data.itemCount >= apiResponse.data.totalItemCount)
              this.tumKayitlarYuklendi = true;
            else this.tumKayitlarYuklendi = false;
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

  KayitBul() {
    this.kayitListesiOku();
  }

  Detay(inputid: number) {
    localStorage.setItem('secilenUser', inputid.toString());
    const modalRef = this.modalService.open(ModalLeaderboard);
    modalRef.result.then((result) => {
      var SelectedOption: userSelections = JSON.parse(localStorage.getItem('secilenAt'));

    }).catch((error) => {
      console.log(error);
    });

  }

}
