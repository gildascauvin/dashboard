import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersModalProgramAthleteManagerMeComponent } from './users-modal-program-athlete-manager-me.component';

describe('UsersModalProgramAthleteManagerMeComponent', () => {
  let component: UsersModalProgramAthleteManagerMeComponent;
  let fixture: ComponentFixture<UsersModalProgramAthleteManagerMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersModalProgramAthleteManagerMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersModalProgramAthleteManagerMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
