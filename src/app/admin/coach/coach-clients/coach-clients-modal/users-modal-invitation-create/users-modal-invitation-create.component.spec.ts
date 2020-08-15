import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersModalInvitationCreateComponent } from './users-modal-invitation-create.component';

describe('UsersModalInvitationCreateComponent', () => {
  let component: UsersModalInvitationCreateComponent;
  let fixture: ComponentFixture<UsersModalInvitationCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersModalInvitationCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersModalInvitationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
