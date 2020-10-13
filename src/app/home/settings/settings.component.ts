import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  version;
  constructor(public http: HttpService, public appVersion: AppVersion) { }

  async ngOnInit() {
    this.version = await this.appVersion.getVersionNumber();
  }
}
