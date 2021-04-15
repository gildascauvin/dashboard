import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachDashboardPerformanceComponent } from './coach-dashboard-performance.component';

describe('CoachDashboardPerformanceComponent', () => {
  let component: CoachDashboardPerformanceComponent;
  let fixture: ComponentFixture<CoachDashboardPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachDashboardPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachDashboardPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
