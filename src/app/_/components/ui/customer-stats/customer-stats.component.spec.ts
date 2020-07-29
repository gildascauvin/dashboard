import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStatsComponent } from './customer-stats.component';

describe('CustomerStatsComponent', () => {
  let component: CustomerStatsComponent;
  let fixture: ComponentFixture<CustomerStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
