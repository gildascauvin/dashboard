import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsExerciceTypeCustomComponent } from './inputs-exercice-type-custom.component';

describe('InputsExerciceTypeCustomComponent', () => {
  let component: InputsExerciceTypeCustomComponent;
  let fixture: ComponentFixture<InputsExerciceTypeCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsExerciceTypeCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsExerciceTypeCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
