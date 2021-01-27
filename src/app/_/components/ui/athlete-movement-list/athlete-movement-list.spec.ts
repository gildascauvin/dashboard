import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteMovementListComponent } from './athlete-movement-list.component';

describe('AthleteMovementListComponent', () => {
  let component: AthleteMovementListComponent;
  let fixture: ComponentFixture<AthleteMovementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteMovementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteMovementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
