import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAthleteDashboardFatigueComponent } from './coach-athlete-dashboard-fatigue.component';

describe('CoachAthleteDashboardFatigueComponent', () => {
  let component: CoachAthleteDashboardFatigueComponent;
  let fixture: ComponentFixture<CoachAthleteDashboardFatigueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachAthleteDashboardFatigueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachAthleteDashboardFatigueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
