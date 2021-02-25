import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStatsSummaryComponent } from './customer-stats-range.component';

describe('CustomerStatsRangeComponent', () => {
  let component: CustomerStatsSummaryComponent;
  let fixture: ComponentFixture<CustomerStatsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerStatsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerStatsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
