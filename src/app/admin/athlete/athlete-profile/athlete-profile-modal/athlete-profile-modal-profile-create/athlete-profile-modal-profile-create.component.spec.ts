import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteProfileModalProfileCreateComponent } from './athlete-profile-modal-profile-create.component';

describe('AthleteProfileModalProfileCreateComponent', () => {
  let component: AthleteProfileModalProfileCreateComponent;
  let fixture: ComponentFixture<AthleteProfileModalProfileCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteProfileModalProfileCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteProfileModalProfileCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
