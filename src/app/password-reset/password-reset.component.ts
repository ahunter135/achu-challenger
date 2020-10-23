import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { ToastController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  emailreset;
  constructor(public router: Router,public http: HttpService,public toast: ToastController, public modal: ModalController) { }


  async sendPwReset() {
   
    this.http.post("/auth/Account/ForgotPassword", { email: this.emailreset }).then(async () => {
      let t = await this.toast.create({
        message: 'Email Sent!',
        duration: 2000
      });
      t.present();
       
    });
  }

  async goToLogin() {

    this.router.navigateByUrl("/login");
  }

   

}
