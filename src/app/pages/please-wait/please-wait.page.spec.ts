import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PleaseWaitPage } from './please-wait.page';

describe('PleaseWaitPage', () => {
  let component: PleaseWaitPage;
  let fixture: ComponentFixture<PleaseWaitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PleaseWaitPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PleaseWaitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
