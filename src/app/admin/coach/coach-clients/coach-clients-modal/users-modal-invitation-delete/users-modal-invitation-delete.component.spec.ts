import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersModalInvitationDeleteComponent } from './users-modal-invitation-delete.component';

describe('UsersModalInvitationDeleteComponent', () => {
  let component: UsersModalInvitationDeleteComponent;
  let fixture: ComponentFixture<UsersModalInvitationDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersModalInvitationDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersModalInvitationDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
