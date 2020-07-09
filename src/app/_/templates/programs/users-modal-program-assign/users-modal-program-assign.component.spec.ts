import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersModalProgramAssignComponent } from './users-modal-program-assign.component';

describe('UsersModalProgramAssignComponent', () => {
  let component: UsersModalProgramAssignComponent;
  let fixture: ComponentFixture<UsersModalProgramAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersModalProgramAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersModalProgramAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
