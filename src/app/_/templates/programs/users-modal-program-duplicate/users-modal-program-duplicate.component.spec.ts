import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersModalProgramDuplicateComponent } from './users-modal-program-duplicate.component';

describe('UsersModalProgramDuplicateComponent', () => {
  let component: UsersModalProgramDuplicateComponent;
  let fixture: ComponentFixture<UsersModalProgramDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersModalProgramDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersModalProgramDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
