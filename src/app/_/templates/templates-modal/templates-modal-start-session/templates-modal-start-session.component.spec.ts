import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesModalStartSessionComponent } from './templates-modal-start-session.component';

describe('TemplatesModalStartSessionComponent', () => {
  let component: TemplatesModalStartSessionComponent;
  let fixture: ComponentFixture<TemplatesModalStartSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesModalStartSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesModalStartSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
