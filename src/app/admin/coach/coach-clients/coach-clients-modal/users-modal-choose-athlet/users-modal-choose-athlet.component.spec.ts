import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersModalChooseAthletComponent } from './users-modal-choose-athlet.component';

describe('UsersModalChooseAthletComponent', () => {
  let component: UsersModalChooseAthletComponent;
  let fixture: ComponentFixture<UsersModalChooseAthletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersModalChooseAthletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersModalChooseAthletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
