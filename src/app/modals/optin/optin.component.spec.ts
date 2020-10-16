import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OptinComponent } from './optin.component';

describe('OptinComponent', () => {
  let component: OptinComponent;
  let fixture: ComponentFixture<OptinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptinComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OptinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
