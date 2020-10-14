import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Chart } from 'chart.js';
import { GlobalService } from '../services/global.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { ModalController } from '@ionic/angular';
import { DailyCheckupComponent } from '../modals/daily-checkup/daily-checkup.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild("lineCanvas") lineCanvas: ElementRef;

  chartLoaded = false;
  homeBar = "today";
  navBar = "today"
  currentNav = this.navBar;
  currentHome = this.homeBar;
  stepsProgress = 0;
  stepsProgressBar = 0;
  sleepProgress = 0;
  sleepProgressBar = 0;
  caloriesProgress = 0;
  caloriesProgressBar = 0;
  exerciseProgress = 0;
  exerciseProgressBar = 0;
  overallCompletion = 0;
  overallCompletionBar = 0;
  HRZones = <any>[];
  stressScore = 0;
  fatigueScore = 0;
  lineChart: Chart;
  constructor(public globalService: GlobalService, public storage: StorageService, public router: Router, public http: HttpService, public modalController: ModalController) { }

  async ionViewDidEnter() {
    var loggedIn = await this.storage.getItem("loggedIn");

    if (loggedIn == undefined) {
      this.http.logout();
    } else {
      await this.http.setUserCreds(loggedIn);
      this.getDailyGoals();
      this.getHRZones();
      this.getFitbitScores();
    }
  }

  async getDailyGoals() {
    let response = await this.http.get('/api/fitbit/dailygoals', {});
    console.log(response);
    if (response == undefined) {
      this.http.logout();
      return;
    }
    this.overallCompletion = response.overallCompletion;
    this.overallCompletionBar = response.overallCompletion / 100;
    this.http.user.overallCompletion = this.overallCompletion;
    for (let i = 0; i < response.goals.length; i++) {
      if (response.goals[i].goalType == 'steps') {
        this.stepsProgress = Math.trunc((response.goals[i].progress / response.goals[i].goal) * 100);
        this.stepsProgressBar = (response.goals[i].progress / response.goals[i].goal);
      } else if (response.goals[i].goalType == 'sleepDuration') {
        this.sleepProgress = Math.trunc((response.goals[i].progress / response.goals[i].goal) * 100);
        this.sleepProgressBar = (response.goals[i].progress / response.goals[i].goal);
      } else if (response.goals[i].goalType == 'calories') {
        this.caloriesProgress = Math.trunc((response.goals[i].progress / response.goals[i].goal) * 100);
        this.caloriesProgressBar = (response.goals[i].progress / response.goals[i].goal);
      } else if (response.goals[i].goalType == 'exerciseMinuutes') {
        this.exerciseProgress = Math.trunc((response.goals[i].progress / response.goals[i].goal) * 100);
        this.exerciseProgressBar = (response.goals[i].progress / response.goals[i].goal);
      }
    }
  }


  async getHRZones() {
    let response = await this.http.get('/api/fitbit/HRZ', {});
    console.log(response);
    if (response == undefined) {
      this.http.logout();
      return;
    }
    var data = [];
    var labels = [];

    for (let i = 1; i < response.length; i++) {
      response[i].progress = <any>response[i].minutes / 100;
      data.push(response[i].minutes);
      labels.push(response[i].name);
    }
    this.HRZones = data;
    if (this.chartLoaded) return;
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            data: data,
            borderAlign: 'inner',
            backgroundColor: [
              '#7d99cc', '#83d1de', '#76c7ae'
            ]
          }
        ]
      },
      options: {
        cutoutPercentage: 75,
        scales: {
          yAxes: [{
            gridLines: {
              display: false
            },
            display: false
          }],
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
    this.chartLoaded = true;
  }

  async getFitbitScores() {
    let response = await this.http.get('/api/scores/fitbit', {});
    console.log(response);
    if (response == undefined) {
      this.http.logout();
      return;
    }
    this.stressScore = response.stressScoreValue;
    this.fatigueScore = response.fatigueScoreValue;
  }

  segmentChanged(ev: any) {
    this.currentHome = ev.detail.value;
  }

  navChanged(ev: any) {
    this.currentNav = ev.detail.value;
    this.globalService.publishData(this.currentNav);
    this.getContent().scrollToTop(100);
  }

  async openDailyCheckup() {
    let modal = await this.modalController.create({
      component: DailyCheckupComponent,
      cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
  }

  getContent() {
    return document.querySelector('ion-content');
  }

}
