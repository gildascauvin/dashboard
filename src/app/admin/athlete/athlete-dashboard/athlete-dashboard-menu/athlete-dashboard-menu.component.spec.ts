import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteDashboardMenuComponent } from './athlete-dashboard-menu.component';

describe('AthleteDashboardMenuComponent', () => {
  let component: AthleteDashboardMenuComponent;
  let fixture: ComponentFixture<AthleteDashboardMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteDashboardMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteDashboardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
