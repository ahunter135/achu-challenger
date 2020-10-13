import { Component, OnInit, EventEmitter } from '@angular/core';
import { Options, LabelType } from 'ng5-slider';
import { ModalController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-daily-checkup',
  templateUrl: './daily-checkup.component.html',
  styleUrls: ['./daily-checkup.component.scss'],
})
export class DailyCheckupComponent implements OnInit {
  value = 0;
  step = 0;
  checkUps = [];
  manualRefreshEnabled: boolean = true;
  manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  options: Options = {
    floor: 0,
    ceil: 4,
    vertical: true,
    showSelectionBar: false,
    showTicks: false,
    showTicksValues: true,
    translate: (value: number, label: LabelType): string => {
      if (this.step == 0) {
        if (value == 0) return `Not Tired`;
        else if (value == 1) return `Slightly Tired`;
        else if (value == 2) return `Tired`;
        else if (value == 3) return `Very Tired`;
        else return `Extremely Tired`;
      } else if (this.step == 1) {
        if (value == 0) return `Not Stressed`;
        else if (value == 1) return `Slightly Stressed`;
        else if (value == 2) return `Stressed`;
        else if (value == 3) return `Very Stressed`;
        else return `Extremely Stressed`;
      } else if (this.step == 2) {
        if (value == 0) return `Not Anxious`;
        else if (value == 1) return `Slightly Anxious`;
        else if (value == 2) return `Anxious`;
        else if (value == 3) return `Very Anxious`;
        else return `Extremely Anxious`;
      }
    }
  };

  constructor(public modalCtrl: ModalController, public http: HttpService) { }

  ngOnInit() { }

  incStep() {
    // get value and store
    this.checkUps.push(this.value);
    this.value = 0;
    this.step++;
    this.manualRefresh.emit();
  }

  async submit() {
    //submit daily checkin
    this.checkUps.push(this.value);

    await this.http.postDailyCheckup(this.checkUps[2], this.checkUps[0], this.checkUps[1]);
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
