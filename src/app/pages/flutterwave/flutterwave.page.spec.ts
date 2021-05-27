import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlutterwavePage } from './flutterwave.page';

describe('FlutterwavePage', () => {
  let component: FlutterwavePage;
  let fixture: ComponentFixture<FlutterwavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlutterwavePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FlutterwavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
