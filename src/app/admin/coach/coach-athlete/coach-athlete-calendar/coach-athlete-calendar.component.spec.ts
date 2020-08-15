import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAthleteCalendarComponent } from './coach-athlete-calendar.component';

describe('CoachAthleteCalendarComponent', () => {
  let component: CoachAthleteCalendarComponent;
  let fixture: ComponentFixture<CoachAthleteCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachAthleteCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachAthleteCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
