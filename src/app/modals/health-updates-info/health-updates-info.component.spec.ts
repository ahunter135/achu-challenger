import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HealthUpdatesInfoComponent } from './health-updates-info.component';

describe('HealthUpdatesInfoComponent', () => {
  let component: HealthUpdatesInfoComponent;
  let fixture: ComponentFixture<HealthUpdatesInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthUpdatesInfoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HealthUpdatesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
