import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteProfilePerformanceComponent } from './athlete-profile-performance.component';

describe('AthleteProfilePerformanceComponent', () => {
  let component: AthleteProfilePerformanceComponent;
  let fixture: ComponentFixture<AthleteProfilePerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteProfilePerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteProfilePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
