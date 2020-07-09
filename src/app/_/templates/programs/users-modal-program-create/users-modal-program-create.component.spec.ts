import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersModalProgramCreateComponent } from './users-modal-program-create.component';

describe('UsersModalProgramCreateComponent', () => {
  let component: UsersModalProgramCreateComponent;
  let fixture: ComponentFixture<UsersModalProgramCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersModalProgramCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersModalProgramCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
