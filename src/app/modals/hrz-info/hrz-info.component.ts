 
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-hrz-info',
  templateUrl: './hrz-info.component.html',
  styleUrls: ['./hrz-info.component.scss'],
})
export class HrzInfoComponent {

  constructor(public http: HttpService, public toast: ToastController, public modal: ModalController) { }

  dismiss() {
    this.modal.dismiss();
  }


}

