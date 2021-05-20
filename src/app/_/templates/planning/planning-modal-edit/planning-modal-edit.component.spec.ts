import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningModalEditComponent } from './planning-modal-edit.component';

describe('PlanningModalEditComponent', () => {
  let component: PlanningModalEditComponent;
  let fixture: ComponentFixture<PlanningModalEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningModalEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
