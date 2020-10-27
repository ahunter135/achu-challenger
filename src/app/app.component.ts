import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { HomePage } from './home/home.page';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private deepLinks: Deeplinks,
    private http: HttpService,
    private toast: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleBlackTranslucent();
      this.statusBar.backgroundColorByHexString('#ffffff');
      this.splashScreen.hide();
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      this.deepLinks.route({
        '/home': HomePage,
      }).subscribe(match => {
        alert(JSON.stringify(match));
        // match.$route - the route we matched, which is the matched entry from the arguments to route()
        // match.$args - the args passed in the link
        // match.$link - the full link data
      }, async nomatch => {
        let link = nomatch.$link.queryString;
        let code = link.split('code=')[1];

        let resp = await this.http.get("/api/FitBitAuth/Android", { code: code });
        if (resp) {
          let response = await this.http.get('/api/Account/GetUserSettings', {});
          this.http.userSettings = response;

          let t = await this.toast.create({
            message: 'Fitbit Authorized',
            duration: 2000
          });
          t.present();
        } else {
          let t = await this.toast.create({
            message: 'Authorization Failed',
            duration: 2000
          });
          t.present();
        }
      });
    });
  }
}
