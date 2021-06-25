import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAthleteDashboardWellnessComponent } from './coach-athlete-dashboard-wellness.component';

describe('CoachAthleteDashboardWellnessComponent', () => {
  let component: CoachAthleteDashboardWellnessComponent;
  let fixture: ComponentFixture<CoachAthleteDashboardWellnessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachAthleteDashboardWellnessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachAthleteDashboardWellnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
