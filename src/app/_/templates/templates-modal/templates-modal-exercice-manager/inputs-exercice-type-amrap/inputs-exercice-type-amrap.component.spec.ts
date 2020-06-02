import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsExerciceTypeAmrapComponent } from './inputs-exercice-type-amrap.component';

describe('InputsExerciceTypeAmrapComponent', () => {
  let component: InputsExerciceTypeAmrapComponent;
  let fixture: ComponentFixture<InputsExerciceTypeAmrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsExerciceTypeAmrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsExerciceTypeAmrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
