import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsExerciceTypeOpenComponent } from './inputs-exercice-type-open.component';

describe('InputsExerciceTypeOpenComponent', () => {
  let component: InputsExerciceTypeOpenComponent;
  let fixture: ComponentFixture<InputsExerciceTypeOpenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsExerciceTypeOpenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsExerciceTypeOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
