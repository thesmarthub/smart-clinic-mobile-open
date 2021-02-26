import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PandemicPage } from './pandemic.page';

describe('PandemicPage', () => {
  let component: PandemicPage;
  let fixture: ComponentFixture<PandemicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PandemicPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PandemicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
