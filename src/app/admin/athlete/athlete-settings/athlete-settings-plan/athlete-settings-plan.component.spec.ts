import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteSettingsPlanComponent } from './athlete-settings-plan.component';

describe('AthleteSettingsPlanComponent', () => {
  let component: AthleteSettingsPlanComponent;
  let fixture: ComponentFixture<AthleteSettingsPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteSettingsPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteSettingsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
