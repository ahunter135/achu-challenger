import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { HeaderCardComponent } from '../components/header-card/header-card.component';
import { StatsPageComponent } from './competition-page/stats-page.component';
import { ExpandableComponent } from '../components/expandable/expandable.component';
import { MyStatsComponent } from './my-stats/my-stats.component';
import { Ng5SliderModule } from 'ng5-slider';
import { DailyCheckupComponent } from '../modals/daily-checkup/daily-checkup.component';
import { TimePipe } from '../pipes/time.pipe';
import { GoaltypePipe } from '../pipes/goaltype.pipe';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    Ng5SliderModule
  ],
  declarations: [HomePage, HeaderCardComponent, StatsPageComponent, ExpandableComponent, MyStatsComponent,
    DailyCheckupComponent, TimePipe, GoaltypePipe, SettingsComponent],
  entryComponents: [HeaderCardComponent, StatsPageComponent, ExpandableComponent, MyStatsComponent, SettingsComponent]
})
export class HomePageModule { }
