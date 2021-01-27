import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteMovementListUnitLabelComponent } from './athlete-movement-list-unit-label.component';

describe('AthleteMovementListComponent', () => {
  let component: AthleteMovementListUnitLabelComponent;
  let fixture: ComponentFixture<AthleteMovementListUnitLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteMovementListUnitLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteMovementListUnitLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
