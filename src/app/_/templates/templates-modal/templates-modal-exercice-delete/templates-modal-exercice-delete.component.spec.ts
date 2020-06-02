import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesModalExerciceDeleteComponent } from './templates-modal-exercice-delete.component';

describe('TemplatesModalExerciceDeleteComponent', () => {
  let component: TemplatesModalExerciceDeleteComponent;
  let fixture: ComponentFixture<TemplatesModalExerciceDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesModalExerciceDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesModalExerciceDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
