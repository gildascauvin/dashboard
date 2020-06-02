import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesModalWorkoutDeleteComponent } from './templates-modal-workout-delete.component';

describe('TemplatesModalWorkoutDeleteComponent', () => {
  let component: TemplatesModalWorkoutDeleteComponent;
  let fixture: ComponentFixture<TemplatesModalWorkoutDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesModalWorkoutDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesModalWorkoutDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
