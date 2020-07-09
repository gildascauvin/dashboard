import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersModalProgramAthleteManagerComponent } from './users-modal-program-athlete-manager.component';

describe('UsersModalProgramAthleteManagerComponent', () => {
  let component: UsersModalProgramAthleteManagerComponent;
  let fixture: ComponentFixture<UsersModalProgramAthleteManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersModalProgramAthleteManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersModalProgramAthleteManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
