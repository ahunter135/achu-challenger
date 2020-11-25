import { Component } from '@angular/core';
 
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.scss'],
})
export class CompetitionComponent  {

  constructor(public toast: ToastController, public modal: ModalController) { }

  dismiss() {
    this.modal.dismiss();
  }


 
}

