import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteProfileModalProfileEditComponent } from './athlete-profile-modal-profile-edit.component';

describe('AthleteProfileModalProfileEditComponent', () => {
  let component: AthleteProfileModalProfileEditComponent;
  let fixture: ComponentFixture<AthleteProfileModalProfileEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteProfileModalProfileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteProfileModalProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
