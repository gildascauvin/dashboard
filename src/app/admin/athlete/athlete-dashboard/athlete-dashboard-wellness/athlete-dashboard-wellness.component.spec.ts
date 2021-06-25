import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteDashboardWellnessComponent } from './athlete-dashboard-wellness.component';

describe('AthleteDashboardWellnessComponent', () => {
  let component: AthleteDashboardWellnessComponent;
  let fixture: ComponentFixture<AthleteDashboardWellnessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteDashboardWellnessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteDashboardWellnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
