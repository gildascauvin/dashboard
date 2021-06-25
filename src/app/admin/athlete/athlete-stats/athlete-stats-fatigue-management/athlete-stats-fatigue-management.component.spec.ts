import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {AthleteStatsFatigueManagementComponent} from "./athlete-stats-fatigue-management.component";

describe('AthleteStatsFatiguePerformanceComponent', () => {
  let component: AthleteStatsFatigueManagementComponent;
  let fixture: ComponentFixture<AthleteStatsFatigueManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteStatsFatigueManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteStatsFatigueManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
