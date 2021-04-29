import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteWellnessComponent } from './athlete-wellness.component';

describe('AthleteWellnessComponent', () => {
  let component: AthleteWellnessComponent;
  let fixture: ComponentFixture<AthleteWellnessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteWellnessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteWellnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
