import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { GlobalService } from 'src/app/services/global.service';
import { HttpService } from 'src/app/services/http.service';


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
  constructor(public navCtrl: NavController, public globalService: GlobalService, public http: HttpService) {
    this.globalService.getObservable().subscribe(async (data) => {
      if (data === 'stats') {
        this.ionViewDidEnter();
      }
    })
  }

  ngOnInit() {

  }

  async ionViewDidEnter() {
    let response = await this.http.get('/api/fitbit/WeeklyComparison', {});
    console.log(response);
    this.weeklyData = response;
    var gridColor = [];
    var maxLines = 11;
    for (var i = 0; i < maxLines; i++) {
      if (i !== 2)
        gridColor.push('rgba(0, 0, 0, 0.1)');
      else
        gridColor.push('rgba(0, 0, 0, 0.1)');
    }
    var data = [];
    for (let i = response.length - 1; i > -1; i--) {
      data.push(response[i].overallCompletion);
    }
    if (this.chartLoaded) return;
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [response[2].name, response[1].name, response[0].name],
        datasets: [{
          data: data,
          backgroundColor: '#FFFFFF', // array should have same number of elements as number of dataset
          borderColor: '#FFFFFF',// array should have same number of elements as number of dataset
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
              maxTicksLimit: maxLines
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
              fontSize: 8,
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
  }

  goBack() {
    this.navCtrl.navigateBack('/home');
  }

}
