import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsExerciceTypeEmomComponent } from './inputs-exercice-type-emom.component';

describe('InputsExerciceTypeEmomComponent', () => {
  let component: InputsExerciceTypeEmomComponent;
  let fixture: ComponentFixture<InputsExerciceTypeEmomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsExerciceTypeEmomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsExerciceTypeEmomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
