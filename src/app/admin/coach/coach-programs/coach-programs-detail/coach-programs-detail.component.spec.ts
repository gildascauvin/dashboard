import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachProgramsDetailComponent } from './coach-programs-detail.component';

describe('CoachProgramsDetailComponent', () => {
  let component: CoachProgramsDetailComponent;
  let fixture: ComponentFixture<CoachProgramsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachProgramsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachProgramsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
