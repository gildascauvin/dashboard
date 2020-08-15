import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachSettingsPlanComponent } from './coach-settings-plan.component';

describe('CoachSettingsPlanComponent', () => {
  let component: CoachSettingsPlanComponent;
  let fixture: ComponentFixture<CoachSettingsPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachSettingsPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachSettingsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
