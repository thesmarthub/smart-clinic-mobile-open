import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LabPage } from './lab.page';

describe('LabPage', () => {
  let component: LabPage;
  let fixture: ComponentFixture<LabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
