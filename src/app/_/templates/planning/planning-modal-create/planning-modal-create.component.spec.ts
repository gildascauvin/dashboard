import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningModalCreateComponent } from './planning-modal-create.component';

describe('planningModalCreateComponent', () => {
  let component: PlanningModalCreateComponent;
  let fixture: ComponentFixture<PlanningModalCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningModalCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningModalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
