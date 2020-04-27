import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAthleteProfileComponent } from './coach-athlete-profile.component';

describe('CoachAthleteProfileComponent', () => {
  let component: CoachAthleteProfileComponent;
  let fixture: ComponentFixture<CoachAthleteProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachAthleteProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachAthleteProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
