import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachAthleteLeadboardComponent } from './coach-athlete-leadboard.component';

describe('CoachAthleteLeadboardComponent', () => {
  let component: CoachAthleteLeadboardComponent;
  let fixture: ComponentFixture<CoachAthleteLeadboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachAthleteLeadboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachAthleteLeadboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
