import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachSettingsPlanModalComponent } from './coach-settings-plan-modal.component';

describe('CoachSettingsPlanModalComponent', () => {
  let component: CoachSettingsPlanModalComponent;
  let fixture: ComponentFixture<CoachSettingsPlanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachSettingsPlanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachSettingsPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
