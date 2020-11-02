import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-optin',
  templateUrl: './optin.component.html',
  styleUrls: ['./optin.component.scss'],
})
export class OptinComponent {

  constructor(public http: HttpService, public toast: ToastController, public modal: ModalController) { }


  dismiss() {
    this.modal.dismiss();
  }

  async optIn(status) {

    this.http.put("/api/Account/UpdateFitbitShare", { "fitbitShare": status }).then(async () => {
      let t = await this.toast.create({
        message: 'Opt In Successful',
        duration: 2000
      });
      t.present();
      let response = await this.http.get('/api/Account/GetUserSettings', {});
      this.http.userSettings = response.body;
    });
  }






}
