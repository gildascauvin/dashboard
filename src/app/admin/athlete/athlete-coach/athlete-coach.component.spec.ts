import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteCoachComponent } from './athlete-coach.component';

describe('AthleteCoachComponent', () => {
  let component: AthleteCoachComponent;
  let fixture: ComponentFixture<AthleteCoachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteCoachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
