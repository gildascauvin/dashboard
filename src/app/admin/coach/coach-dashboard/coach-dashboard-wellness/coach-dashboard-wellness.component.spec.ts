import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachDashboardWellnessComponent } from './coach-dashboard-wellness.component';

describe('CoachDashboardWellnessComponent', () => {
  let component: CoachDashboardWellnessComponent;
  let fixture: ComponentFixture<CoachDashboardWellnessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachDashboardWellnessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachDashboardWellnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
