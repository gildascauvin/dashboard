import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesModalEditComponent } from './templates-modal-edit.component';

describe('TemplatesModalEditComponent', () => {
  let component: TemplatesModalEditComponent;
  let fixture: ComponentFixture<TemplatesModalEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesModalEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
