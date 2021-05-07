import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteOnboardingComponent } from './athlete-onboarding.component';

describe('AthleteOnboardingComponent', () => {
  let component: AthleteOnboardingComponent;
  let fixture: ComponentFixture<AthleteOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteOnboardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
