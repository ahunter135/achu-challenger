import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent {

  constructor(public http: HttpService, public toast: ToastController, public modal: ModalController) { }

  dismiss() {
    this.modal.dismiss();
  }


}
