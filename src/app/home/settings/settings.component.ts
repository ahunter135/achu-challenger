import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { ToastController, ModalController } from '@ionic/angular';
import { OptinComponent } from 'src/app/modals/optin/optin.component';
import { UpdateCharacterComponent } from 'src/app/modals/update-character/update-character.component';
import { PrivacyComponent } from 'src/app/modals/privacy/privacy.component';
import { TermsComponent } from 'src/app/modals/terms/terms.component';
import { PostLoginComponent } from 'src/app/modals/post-login/post-login.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  version;
  constructor(public http: HttpService, public appVersion: AppVersion, 
    public modalCtrl: ModalController, public toast: ToastController, public modal: ModalController) { }

  async ngOnInit() {
    this.version = await this.appVersion.getVersionNumber();
  }

  async optIn() {
    let modal = await this.modal.create({
      component: OptinComponent,
      cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
  }

  async viewPrivacy() {
    let modal = await this.modal.create({
      component: PrivacyComponent,
      cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
  }

  async viewTerms() {
    console.log("jere");
    let modal = await this.modal.create({
      component: TermsComponent,
      cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
  }

  async updateCharacter() {
    let modal = await this.modal.create({
      component: UpdateCharacterComponent,
      cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
  }

  async showOnboarding() {
    const modal = await this.modalCtrl.create({
      component: PostLoginComponent
    });
    await modal.present();
  }



}
