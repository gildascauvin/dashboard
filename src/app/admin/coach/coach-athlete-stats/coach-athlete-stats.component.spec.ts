import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAthleteStatsComponent } from './coach-athlete-stats.component';

describe('CoachAthleteStatsComponent', () => {
  let component: CoachAthleteStatsComponent;
  let fixture: ComponentFixture<CoachAthleteStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachAthleteStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachAthleteStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
