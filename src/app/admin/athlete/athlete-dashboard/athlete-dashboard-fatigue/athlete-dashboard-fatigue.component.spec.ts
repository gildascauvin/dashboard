import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteDashboardFatigueComponent } from './athlete-dashboard-fatigue.component';

describe('AthleteDashboardFatigueComponent', () => {
  let component: AthleteDashboardFatigueComponent;
  let fixture: ComponentFixture<AthleteDashboardFatigueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteDashboardFatigueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteDashboardFatigueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
