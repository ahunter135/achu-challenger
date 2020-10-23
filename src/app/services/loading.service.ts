import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading;
  isLoading = false;
  constructor(public loadingController: LoadingController) { }

  async presentLoading() {
    this.isLoading = true;
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
    });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.isLoading) {
      this.isLoading = false;
      await this.loading.dismiss();
    }
  }
}
