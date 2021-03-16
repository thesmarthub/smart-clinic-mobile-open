import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HospitalRegPage } from './hospital-reg.page';

describe('HospitalRegPage', () => {
  let component: HospitalRegPage;
  let fixture: ComponentFixture<HospitalRegPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalRegPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HospitalRegPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
