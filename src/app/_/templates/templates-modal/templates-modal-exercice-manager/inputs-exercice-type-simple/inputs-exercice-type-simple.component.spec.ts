import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsExerciceTypeSimpleComponent } from './inputs-exercice-type-simple.component';

describe('InputsExerciceTypeSimpleComponent', () => {
  let component: InputsExerciceTypeSimpleComponent;
  let fixture: ComponentFixture<InputsExerciceTypeSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsExerciceTypeSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsExerciceTypeSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
