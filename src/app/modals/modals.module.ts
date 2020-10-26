import { NgModule } from '@angular/core';
import { DailyCheckupComponent } from './daily-checkup/daily-checkup.component';
import { HealthUpdatesInfoComponent } from './health-updates-info/health-updates-info.component';
import { HrzInfoComponent } from './hrz-info/hrz-info.component';
import { OptinComponent } from './optin/optin.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { UpdateCharacterComponent } from './update-character/update-character.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Ng5SliderModule } from 'ng5-slider';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        Ng5SliderModule
    ],
    declarations: [DailyCheckupComponent, HealthUpdatesInfoComponent, HrzInfoComponent, OptinComponent, PrivacyComponent, TermsComponent, UpdateCharacterComponent],
    entryComponents: [DailyCheckupComponent, HealthUpdatesInfoComponent, HrzInfoComponent, OptinComponent, PrivacyComponent, TermsComponent, UpdateCharacterComponent]
})
export class ModalsModule { }
