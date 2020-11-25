import { Component } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-my-stats',
  templateUrl: './my-stats.component.html',
  styleUrls: ['./my-stats.component.scss'],
})
export class MyStatsModalComponent {


 constructor(public toast: ToastController, public modal: ModalController) { }

 dismiss() {
  this.modal.dismiss();
  }

}
