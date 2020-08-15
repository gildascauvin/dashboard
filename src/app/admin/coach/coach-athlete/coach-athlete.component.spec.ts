import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAthleteComponent } from './coach-athlete.component';

describe('CoachAthleteComponent', () => {
  let component: CoachAthleteComponent;
  let fixture: ComponentFixture<CoachAthleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachAthleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachAthleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
