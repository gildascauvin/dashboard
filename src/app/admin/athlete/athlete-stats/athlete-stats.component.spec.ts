import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteStatsComponent } from './athlete-stats.component';

describe('AthleteStatsComponent', () => {
  let component: AthleteStatsComponent;
  let fixture: ComponentFixture<AthleteStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
