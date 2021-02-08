import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteStatsTrainingOverloadComponent } from './athlete-stats.component';

describe('AthleteStatsComponent', () => {
  let component: AthleteStatsTrainingOverloadComponent;
  let fixture: ComponentFixture<AthleteStatsTrainingOverloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteStatsTrainingOverloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteStatsTrainingOverloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
