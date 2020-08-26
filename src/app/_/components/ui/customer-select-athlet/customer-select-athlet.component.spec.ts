import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSelectAthletComponent } from './customer-select-athlet.component';

describe('CustomerSelectAthletComponent', () => {
  let component: CustomerSelectAthletComponent;
  let fixture: ComponentFixture<CustomerSelectAthletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSelectAthletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSelectAthletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
