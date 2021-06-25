import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAthleteDashboardTrainingComponent } from './coach-athlete-dashboard-training.component';

describe('CoachAthleteDashboardTrainingComponent', () => {
  let component: CoachAthleteDashboardTrainingComponent;
  let fixture: ComponentFixture<CoachAthleteDashboardTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachAthleteDashboardTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachAthleteDashboardTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
