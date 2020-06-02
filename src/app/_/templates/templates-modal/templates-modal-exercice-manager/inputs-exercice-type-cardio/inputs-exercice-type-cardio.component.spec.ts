import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsExerciceTypeCardioComponent } from './inputs-exercice-type-cardio.component';

describe('InputsExerciceTypeCardioComponent', () => {
  let component: InputsExerciceTypeCardioComponent;
  let fixture: ComponentFixture<InputsExerciceTypeCardioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsExerciceTypeCardioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsExerciceTypeCardioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
