import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HealthShopPage } from './health-shop.page';

describe('HealthShopPage', () => {
  let component: HealthShopPage;
  let fixture: ComponentFixture<HealthShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthShopPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HealthShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
