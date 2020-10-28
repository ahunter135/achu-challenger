import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { GlobalService } from 'src/app/services/global.service';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';


@Component({
  selector: 'app-my-stats',
  templateUrl: './my-stats.component.html',
  styleUrls: ['./my-stats.component.scss'],
})
export class MyStatsComponent implements OnInit {
  @ViewChild("barCanvas") barCanvas: ElementRef;
  weeklyData;
  barChart: Chart;
  chartLoaded = false;
  loading;
  constructor(public navCtrl: NavController, public globalService: GlobalService, public http: HttpService, public loadingService: LoadingService) {
    this.globalService.getObservable().subscribe(async (data) => {
      if (data === 'stats') {
        this.ionViewDidEnter();
      }
    })
  }

  ngOnInit() {

  }

  async ionViewDidEnter() {
    if (!this.chartLoaded)
      this.presentLoading();
    else return;
    let response = await this.http.get('/api/fitbit/WeeklyComparison', {});
    if (response == undefined) {
      this.loadingService.dismissLoading();
      return;
    }
    this.weeklyData = response;
    var gridColor = [];
    var maxLines = 15;
    for (var i = 0; i < maxLines; i++) {
      if (i !== 1)
        gridColor.push('rgba(0, 0, 0, 0.1)');
      else
        gridColor.push('#44c4a1');
    }
    var data = [];
    for (let i = response.length - 1; i > -1; i--) {
      data.push(response[i].overallCompletion);
    }
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [response[2].name, response[1].name, response[0].name],
        datasets: [{
          data: data,
          backgroundColor: '#44c4a1', // array should have same number of elements as number of dataset
          borderColor: '#44c4a1',// array should have same number of elements as number of dataset
          borderWidth: 1,
          barThickness: 15
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              fontSize: 12,
              display: true,
              max: 120,
              min: 0,
              callback: function (value, index, values) {
                // if (value != 100) return "";
                // else return "100%";

                return value + "%";

              }
            },
            gridLines: {
              display: true,
              drawBorder: false,
              color: gridColor
            },
            display: true
          }],
          xAxes: [{
            ticks: {
              fontSize: 10,
              fontColor: '#000000',
              padding: 1,
              maxRotation: 0
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
    this.chartLoaded = true;
    this.loadingService.dismissLoading();
  }

  goBack() {
    this.navCtrl.navigateBack('/home');
  }

  async presentLoading() {
    this.loadingService.presentLoading();
  }
}
