import { Component } from '@angular/core';
 
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-stress-fatigue',
  templateUrl: './stress-fatigue.component.html',
  styleUrls: ['./stress-fatigue.component.scss'],
})
export class StressFatigueComponent  {

  constructor(public toast: ToastController, public modal: ModalController) { }


  dismiss() {
    this.modal.dismiss();
  }


 
}
