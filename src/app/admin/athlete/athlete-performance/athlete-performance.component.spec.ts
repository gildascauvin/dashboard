import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthletePerformanceComponent } from './athlete-performance.component';

describe('AthletePerformanceComponent', () => {
  let component: AthletePerformanceComponent;
  let fixture: ComponentFixture<AthletePerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthletePerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthletePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
