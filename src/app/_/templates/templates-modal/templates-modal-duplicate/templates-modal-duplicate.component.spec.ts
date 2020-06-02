import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesModalDuplicateComponent } from './templates-modal-duplicate.component';

describe('TemplatesModalDuplicateComponent', () => {
  let component: TemplatesModalDuplicateComponent;
  let fixture: ComponentFixture<TemplatesModalDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesModalDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesModalDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
