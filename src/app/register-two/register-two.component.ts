import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PickerController, ModalController, LoadingController } from '@ionic/angular';
import { HttpService } from '../services/http.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-register-two',
  templateUrl: './register-two.component.html',
  styleUrls: ['./register-two.component.scss'],
})
export class RegisterTwoComponent implements OnInit {
  obj = {
    firstName: "",
    lastName: "",
    height: "",
    heightUnit: "",
    weight: "",
    weightUnit: "",
    gender: "",
    email: "",
    password: "",
    tenantId: "de894cdf-c6a5-483b-b010-05e0dc25ca22",
    dateOfBirth: "",
    acceptNewsEmail: true,
    registerType: "fitbit"
  }
  loading;
  constructor(public router: Router, public picker: PickerController, public http: HttpService, public storage: StorageService, public modalCtrl: ModalController, public loadingController: LoadingController) { }

  ngOnInit() {
    let params = this.router.getCurrentNavigation().extras.state;

    this.obj.email = params.email;
    this.obj.password = params.password;
  }

  async register() {
    this.presentLoading();
    let response = await this.http.post("/auth/Register", this.obj);

    if (response.status == undefined) {
      let loginResponse = { key: "loggedIn", value: JSON.stringify(response) };
      await this.storage.setItem(loginResponse);
      await this.http.setUserCreds(response);
      this.loading.dismiss();
      this.router.navigateByUrl("/home", {
        replaceUrl: true
      });
    }
  }

  async openHeightPicker() {
    const picker = await this.picker.create({
      columns: this.getColumns(0, 400, 'height'),
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: "Confirm",
        handler: (value) => {
          this.obj.height = value[0].value;
          this.obj.heightUnit = value[1].value;
        }
      }]
    })
    await picker.present();
  }

  async openWeightPicker() {
    const picker = await this.picker.create({
      columns: this.getColumns(0, 400, 'weight'),
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: "Confirm",
        handler: (value) => {
          this.obj.weight = value[0].value;
          this.obj.weightUnit = value[1].value;
        }
      }]
    })
    await picker.present();
  }

  async openGenderPicker() {
    let columns = [];
    columns.push({
      name: 0,
      options: [{
        text: 'Male',
        value: 'm'
      }, {
        text: 'Female',
        value: 'f'
      }]
    });
    const picker = await this.picker.create({
      columns: columns,
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: "Confirm",
        handler: (value) => {
          this.obj.gender = value[0].value;
        }
      }]
    })
    await picker.present();
  }

  getColumns(min, max, flag) {
    let columns = [];
    columns.push({
      name: 0,
      options: this.getColumnOptions(min, max)
    });
    columns.push({
      name: 1,
      options: flag == 'height' ? [{ text: 'cm', value: 'cm' }, { text: 'in', value: 'in' }] : [{ text: 'kg', value: 'kg' }, { text: 'lb', value: 'lb' }]
    })

    return columns;
  }

  getColumnOptions(min, max) {
    let options = [];
    for (let i = min; i <= max; i++) {
      options.push({
        text: i,
        value: i
      })
    }

    return options;
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
    });
    await this.loading.present();
  }

}
