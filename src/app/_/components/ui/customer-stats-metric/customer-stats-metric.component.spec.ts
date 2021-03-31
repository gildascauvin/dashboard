import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStatsMetricComponent } from './customer-stats-metric.component';

describe('CustomerStatsMetricComponent', () => {
  let component: CustomerStatsMetricComponent;
  let fixture: ComponentFixture<CustomerStatsMetricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerStatsMetricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerStatsMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
