import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStatsRangeComponent } from './customer-stats-range.component';

describe('CustomerStatsRangeComponent', () => {
  let component: CustomerStatsRangeComponent;
  let fixture: ComponentFixture<CustomerStatsRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerStatsRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerStatsRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
