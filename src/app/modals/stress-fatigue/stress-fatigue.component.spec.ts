import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StressFatigueComponent } from './stress-fatigue.component';

describe('StressFatigueComponent', () => {
  let component: StressFatigueComponent;
  let fixture: ComponentFixture<StressFatigueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StressFatigueComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StressFatigueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
