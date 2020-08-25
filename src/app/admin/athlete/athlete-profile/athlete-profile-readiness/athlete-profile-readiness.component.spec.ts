import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteProfileReadinessComponent } from './athlete-profile-readiness.component';

describe('AthleteProfileReadinessComponent', () => {
  let component: AthleteProfileReadinessComponent;
  let fixture: ComponentFixture<AthleteProfileReadinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteProfileReadinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteProfileReadinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
