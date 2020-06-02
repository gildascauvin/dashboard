import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesModalCreateComponent } from './templates-modal-create.component';

describe('TemplatesModalCreateComponent', () => {
  let component: TemplatesModalCreateComponent;
  let fixture: ComponentFixture<TemplatesModalCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesModalCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesModalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
