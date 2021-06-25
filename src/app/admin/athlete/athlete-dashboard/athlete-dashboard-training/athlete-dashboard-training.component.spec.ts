import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteDashboardTrainingComponent } from './athlete-dashboard-training.component';

describe('AthleteDashboardTrainingComponent', () => {
  let component: AthleteDashboardTrainingComponent;
  let fixture: ComponentFixture<AthleteDashboardTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteDashboardTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteDashboardTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
