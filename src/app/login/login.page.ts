import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { NavController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';
import { ModalController, } from '@ionic/angular';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: "";
  password: "";
  loggingIn = false;
  constructor(public router: Router, public storage: StorageService, public navCtrl: NavController, public http: HttpService, public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async login() {
    this.loggingIn = true;
    let response = await this.http.post("/auth/Auth/Login", {
      email: this.email,
      password: this.password
    });

    if (response.status == 200) {
      //  if (response.tenantId == "6a75bd8d-248e-41aa-9939-91632c52c5d6") {
      let loginResponse = { key: "loggedIn", value: JSON.stringify(response.body) };
      await this.storage.setItem(loginResponse);
      await this.http.setUserCreds(response.body);
      this.loggingIn = false;
      this.router.navigateByUrl("/home", {
        replaceUrl: true
      });
      //} else {
      //  alert("Unauthorized");
      // }
    } else {
      if (response.status == 401) alert("Invalid Email or Password");
      else alert("Please enter an Email and Password.");
      this.loggingIn = false;
    }

  }

  async goToSignUp() {
    this.router.navigateByUrl("/register");
  }

  async goToPwReset() {
    this.router.navigateByUrl("/password-reset");
  }

}
