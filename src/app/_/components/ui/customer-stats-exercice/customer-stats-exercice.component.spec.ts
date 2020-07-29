import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStatsExerciceComponent } from './customer-stats-exercice.component';

describe('CustomerStatsExerciceComponent', () => {
  let component: CustomerStatsExerciceComponent;
  let fixture: ComponentFixture<CustomerStatsExerciceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerStatsExerciceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerStatsExerciceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
