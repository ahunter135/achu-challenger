import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent {

  constructor(public http: HttpService, public toast: ToastController, public modal: ModalController) { }

  dismiss() {
    this.modal.dismiss();
  }


}
