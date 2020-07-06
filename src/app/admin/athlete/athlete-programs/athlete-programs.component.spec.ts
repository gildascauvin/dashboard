import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteProgramsComponent } from './athlete-programs.component';

describe('AthleteProgramsComponent', () => {
  let component: AthleteProgramsComponent;
  let fixture: ComponentFixture<AthleteProgramsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteProgramsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
