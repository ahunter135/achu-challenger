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
      this.loading = true;
    else return;
    let response = await this.http.get('/api/Fitbit/WeeklyComparison', {});
    if (response.status != 200) {
      this.loading = false;
      return;
    }
    response = response.body;
    this.weeklyData = response;
    response = await this.http.get('/api/Fitbit/WeeklyCompletion', {});
    if (response.status != 200) {
      this.loading = false;
      return;
    }
    let thisWeek = response.body[1];
    let lastWeek = response.body[0];
    var gridColor = [];
    var maxLines = 15;
    for (var i = 0; i < maxLines; i++) {
      if (i !== 1)
        gridColor.push('rgba(0, 0, 0, 0.1)');
      else
        gridColor.push('#44c4a1');
    }
    var data = [];
    for (let i = 0; i < thisWeek.length; i++) {
      data.push(thisWeek[i].overallCompletion);
    }
    var lastData = [];
    var labels = [];
    for (let i = 0; i < lastWeek.length; i++) {
      lastData.push(lastWeek[i].overallCompletion);
      labels.push(lastWeek[i].day);
    }
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: '#44c4a1', // array should have same number of elements as number of dataset
          borderColor: '#44c4a1',// array should have same number of elements as number of dataset
          borderWidth: 3,
          barThickness: 15,
          pointRadius: 0,
          fill: false,
          borderJoinStyle: 'miter'
        }, {
          data: lastData,
          backgroundColor: 'rgba(0, 0, 0, 0.1)', // array should have same number of elements as number of dataset
          borderColor: 'rgba(0, 0, 0, 0.1)',// array should have same number of elements as number of dataset
          borderWidth: 3,
          barThickness: 15,
          pointRadius: 0,
          fill: false,
          borderJoinStyle: 'miter'
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
    this.loading = false
  }

  goBack() {
    this.navCtrl.navigateBack('/home');
  }

  async presentLoading() {
    this.loadingService.presentLoading();
  }
}
