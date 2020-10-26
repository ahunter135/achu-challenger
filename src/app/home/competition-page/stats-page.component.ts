import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Chart } from 'chart.js';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { ToastController, ModalController } from '@ionic/angular';
import { OptinComponent } from 'src/app/modals/optin/optin.component';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.scss'],
})
export class StatsPageComponent implements OnInit {
  @ViewChild("friendsCanvas") friendsCanvas: ElementRef;
  chartLoaded = false;
  public items: any = [];
  friendData = [];
  friendsChart: Chart;
  constructor(public globalService: GlobalService, public router: Router, public http: HttpService, public toast: ToastController, public modal: ModalController,
    public loadingService: LoadingService) {
    this.globalService.getObservable().subscribe(async (data) => {
      if (data === 'competition') {
        this.viewHasEntered();
      }
    })

    this.items = [
      { expanded: false },
      { expanded: false },
      { expanded: false }
    ];
  }

  ngOnInit() {

  }

  expandItem(item): void {
    item.expanded = !item.expanded;
  }

  async viewHasEntered() {
    if (!this.chartLoaded)
      this.loadingService.presentLoading();
    else return;

    this.friendData = await this.http.get('/api/fitbit/friendGoals', {});
    if (this.friendData.length == 0 || !this.http.userSettings.fitBitShare) {
      this.loadingService.dismissLoading();
      return;
    }
    let data = [];
    let labels = [];
    let backgroundColors = [];
    labels.push('You');
    data.push(this.http.user.overallCompletion);
    backgroundColors.push('#51be9f');

    await this.friendData.sort((a, b) =>
      a.overallCompletion - b.overallCompletion
    );

    for (let i = 0; i < this.friendData.length; i++) {
      this.friendData[i].expanded = false;
      data.push(this.friendData[i].overallCompletion);
      labels.push(this.friendData[i].name);
      backgroundColors.push('#9bbeff');
    }
    /*
        this.friendsChart = new Chart(this.friendsCanvas.nativeElement, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: backgroundColors,
              boorderColor: backgroundColors,
              borderWidth: 1,
              barThickness: 8
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  fontSize: 8,
                  display: false,
                  max: 100,
                  min: 0
                },
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
                display: true
              }],
              xAxes: [{
                ticks: {
                  fontSize: 10,
                  fontColor: '#000000',
                  padding: 1
                },
                gridLines: {
                  display: false
                },
                display: true
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
        */
    this.chartLoaded = true;

    this.loadingService.dismissLoading();
  }

  goToMyStats() {
    this.router.navigateByUrl("home/my-stats");
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
      let response = await this.http.get('/api/Account/GetUserSettings', { dateOffset: new Date().getTime() });
      this.http.userSettings = response;
    });*/
  }

}
