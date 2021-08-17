import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MarketPlacePage } from './market-place.page';

describe('MarketPlacePage', () => {
  let component: MarketPlacePage;
  let fixture: ComponentFixture<MarketPlacePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPlacePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MarketPlacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
