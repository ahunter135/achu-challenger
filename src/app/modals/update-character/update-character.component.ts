import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-update-character',
  templateUrl: './update-character.component.html',
  styleUrls: ['./update-character.component.scss'],
})
export class UpdateCharacterComponent {
  constructor(public http: HttpService, public toast: ToastController, public modal: ModalController) { }

  characterName = this.http.userSettings.avatarName;

  dismiss() {
    this.modal.dismiss();
  }

  async changeName() {
    this.http.put("/api/Account/UpdateAvatarName", { avatarName: this.characterName }).then(async () => {
      let t = await this.toast.create({
        message: 'AchuCharacter Updated!',
        duration: 2000
      });
      t.present();
      let response = await this.http.get('/api/Account/GetUserSettings', {});
      this.http.userSettings = response;
      this.modal.dismiss();
    });
  }
}
