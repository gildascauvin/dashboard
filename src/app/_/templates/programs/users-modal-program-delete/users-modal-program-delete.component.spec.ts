import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersModalProgramDeleteComponent } from './users-modal-program-delete.component';

describe('UsersModalProgramDeleteComponent', () => {
  let component: UsersModalProgramDeleteComponent;
  let fixture: ComponentFixture<UsersModalProgramDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersModalProgramDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersModalProgramDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
