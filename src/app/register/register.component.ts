import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  email = "";
  password = "";
  form;
  nav = 'registercheck';
  obj = <any>{};
  constructor(public http: HttpService, public storage: StorageService, public router: Router, public toast: ToastController) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$')
      ]))
    });
  }

  async register() {
    var upper = new RegExp("(?=.*[a-z])");
    var lower = new RegExp("(?=.*[A-Z])");
    var number = new RegExp("(?=.*[0-9])");
    var email = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$");
    if (upper.test(this.password) && lower.test(this.password) && number.test(this.password)) {
      if (email.test(this.email)) {
        let response = await this.http.get("/auth/Auth/DoesUserExist", {
          email: this.email
        });

        if (!response.userExists) {
          this.router.navigate(["register-two"], { state: { email: this.email, password: this.password } });
        } else {
          this.show("User Exists. Attempting Login");
          response = await this.http.post("/auth/Auth/Login", {
            email: this.email,
            password: this.password
          });
          if (response.status != 401) {
            let loginResponse = { key: "loggedIn", value: JSON.stringify(response) };
            await this.storage.setItem(loginResponse);
            this.router.navigateByUrl("/home", {
              replaceUrl: true
            });
          } else {
            this.show("Login Failed");
          }
        }
      } else {
        this.show("Invalid Email");
      }
    } else {
      this.show("Invalid Password")
    }
  }

  async show(message) {
    let toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
