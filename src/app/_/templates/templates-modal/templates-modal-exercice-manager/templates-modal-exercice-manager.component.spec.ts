import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesModalExerciceManagerComponent } from './templates-modal-exercice-manager.component';

describe('TemplatesModalExerciceManagerComponent', () => {
  let component: TemplatesModalExerciceManagerComponent;
  let fixture: ComponentFixture<TemplatesModalExerciceManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesModalExerciceManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesModalExerciceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
