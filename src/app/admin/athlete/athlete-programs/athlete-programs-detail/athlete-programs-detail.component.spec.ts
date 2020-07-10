import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteProgramsDetailComponent } from './athlete-programs-detail.component';

describe('AthleteProgramsDetailComponent', () => {
  let component: AthleteProgramsDetailComponent;
  let fixture: ComponentFixture<AthleteProgramsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteProgramsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteProgramsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
