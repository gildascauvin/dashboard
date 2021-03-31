import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsModalEditComponent } from './metrics-modal-edit.component';

describe('MetricsModalEditComponent', () => {
  let component: MetricsModalEditComponent;
  let fixture: ComponentFixture<MetricsModalEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricsModalEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
