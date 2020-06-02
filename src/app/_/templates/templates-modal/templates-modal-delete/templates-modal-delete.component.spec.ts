import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesModalDeleteComponent } from './templates-modal-delete.component';

describe('TemplatesModalDeleteComponent', () => {
  let component: TemplatesModalDeleteComponent;
  let fixture: ComponentFixture<TemplatesModalDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesModalDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesModalDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
