import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsExerciceTypeComplexComponent } from './inputs-exercice-type-complex.component';

describe('InputsExerciceTypeComplexComponent', () => {
  let component: InputsExerciceTypeComplexComponent;
  let fixture: ComponentFixture<InputsExerciceTypeComplexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsExerciceTypeComplexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsExerciceTypeComplexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
