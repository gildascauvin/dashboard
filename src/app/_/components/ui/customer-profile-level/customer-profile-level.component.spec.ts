import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProfileLevelComponent } from './customer-profile-level.component';

describe('CustomerProfileLevelComponent', () => {
  let component: CustomerProfileLevelComponent;
  let fixture: ComponentFixture<CustomerProfileLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerProfileLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerProfileLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
