import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachDashboardPlanningComponent } from './coach-dashboard-planning.component';

describe('CoachDashboardPlanningComponent', () => {
  let component: CoachDashboardPlanningComponent;
  let fixture: ComponentFixture<CoachDashboardPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachDashboardPlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachDashboardPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
