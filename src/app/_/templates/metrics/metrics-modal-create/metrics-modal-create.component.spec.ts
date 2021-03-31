import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsModalCreateComponent } from './metrics-modal-create.component';

describe('MetricsModalCreateComponent', () => {
  let component: MetricsModalCreateComponent;
  let fixture: ComponentFixture<MetricsModalCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricsModalCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsModalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
