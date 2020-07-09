import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersModalProgramEditComponent } from './users-modal-program-edit.component';

describe('UsersModalProgramEditComponent', () => {
  let component: UsersModalProgramEditComponent;
  let fixture: ComponentFixture<UsersModalProgramEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersModalProgramEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersModalProgramEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
