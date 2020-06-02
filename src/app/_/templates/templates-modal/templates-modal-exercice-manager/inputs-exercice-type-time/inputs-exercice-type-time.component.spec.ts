import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsExerciceTypeTimeComponent } from './inputs-exercice-type-time.component';

describe('InputsExerciceTypeTimeComponent', () => {
  let component: InputsExerciceTypeTimeComponent;
  let fixture: ComponentFixture<InputsExerciceTypeTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsExerciceTypeTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsExerciceTypeTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
