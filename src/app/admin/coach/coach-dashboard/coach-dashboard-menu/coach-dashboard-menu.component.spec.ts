import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachDashboardMenuComponent } from './coach-dashboard-menu.component';

describe('CoachDashboardMenuComponent', () => {
  let component: CoachDashboardMenuComponent;
  let fixture: ComponentFixture<CoachDashboardMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachDashboardMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachDashboardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
