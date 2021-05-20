import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningModalDeleteComponent } from './planning-modal-delete.component';

describe('PlanningModalDeleteComponent', () => {
  let component: PlanningModalDeleteComponent;
  let fixture: ComponentFixture<PlanningModalDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningModalDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningModalDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
