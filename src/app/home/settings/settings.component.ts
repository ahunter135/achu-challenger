import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { ToastController, ModalController } from '@ionic/angular';
import { OptinComponent } from 'src/app/modals/optin/optin.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  version;
  constructor(public http: HttpService, public appVersion: AppVersion, public toast: ToastController, public modal: ModalController) { }

  async ngOnInit() {
    this.version = await this.appVersion.getVersionNumber();
  }

  async optIn() {
    let modal = await this.modal.create({
      component: OptinComponent,
      cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
    /*this.http.put("/api/Account/UpdateFitbitShare", { "fitbitShare": true }).then(async () => {
      let t = await this.toast.create({
        message: 'Opt In Successful',
        duration: 2000
      });
      t.present();
      let response = await this.http.get('/api/Account/GetUserSettings', {});
      this.http.userSettings = response;
    });*/
  }
}
