import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Chart } from 'chart.js';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { ToastController, ModalController } from '@ionic/angular';
import { OptinComponent } from 'src/app/modals/optin/optin.component';
import { LoadingService } from 'src/app/services/loading.service';
import { CompetitionComponent } from 'src/app/modals/competition/competition.component';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.scss'],
})
export class StatsPageComponent implements OnInit {
  @ViewChild("infCanvas") infCanvas: ElementRef;
  @ViewChild("perCanvas") perCanvas: ElementRef;
  @ViewChild("friendsCanvas") friendsCanvas: ElementRef;
  chartLoaded = false;
  public items: any = [];
  friendData = [];
  friendsChart: Chart;
  loading = false;
  history = [];
  personCircle: Chart;
  influencerCircle: Chart;
  influencerData;
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
      this.loading = true;
    else return;

    let response = await this.http.get('/api/fitbit/friendGoals', {});
    this.getHistory();
    this.friendData = response.body;
    if (this.friendData.length == 0 || !this.http.userSettings.fitBitShare) {
      this.loading = false
      return;
    }
    let data = [];
    let labels = [];
    let backgroundColors = [];
    labels.push('You');
    data.push(this.http.user.overallCompletion);
    backgroundColors.push('#51be9f');
    this.friendData.push({
      name: this.http.user.firstName + " " + this.http.user.lastName.charAt(0) + ".",
      goals: this.http.user.goals,
      overallCompletion: this.http.user.overallCompletion,
      expanded: false
    })
    await this.friendData.sort((a, b) =>
      b.overallCompletion - a.overallCompletion
    );

    for (let i = 0; i < this.friendData.length; i++) {
      this.friendData[i].expanded = false;
      data.push(this.friendData[i].overallCompletion);
      labels.push(this.friendData[i].name);
      backgroundColors.push('#9bbeff');
    }

    response = await this.http.get("/api/Fitbit/InfluencerCompetition", {});
    if (response.status == 200) {
      console.log(response.body);
      this.influencerData = response.body;
      if (!this.infCanvas || !this.perCanvas) {
        // This gives the app enough time to show the canvas in html then set the data
        setTimeout(async () => {
          await this.loadInfChart();
          await this.loadPersonChart();
        }, 250);
      } else {
        // canvas shown in time; proceed
        await this.loadInfChart();
        await this.loadPersonChart();
      }
      
    }
    
    this.chartLoaded = true;

    this.loading = false
  }

  async loadInfChart() {
    this.influencerCircle = new Chart(this.infCanvas.nativeElement, {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            data: [this.influencerData[1].overallCompletion, 100 - this.influencerData[1].overallCompletion],
            borderAlign: 'inner',
            backgroundColor: [
              '#4cbf9f', '#FFFFFF'
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
  }
  async loadPersonChart() {
    this.personCircle = new Chart(this.perCanvas.nativeElement, {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            data: [this.influencerData[0].overallCompletion, 100 - this.influencerData[0].overallCompletion],
            borderAlign: 'inner',
            backgroundColor: [
              '#4cbf9f', '#FFFFFF'
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
  }

  async getHistory() {
    let response = await this.http.get("/api/Fitbit/WeeklyRanks", {});
    if (response.status == 200) {
      this.history = response.body;
      console.log(this.history);
    }
  }

  goToMyStats() {
    this.router.navigateByUrl("home/my-stats");
  }

  async openCompetition() {
    let modal = await this.modal.create({
      component: CompetitionComponent,
      cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
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
