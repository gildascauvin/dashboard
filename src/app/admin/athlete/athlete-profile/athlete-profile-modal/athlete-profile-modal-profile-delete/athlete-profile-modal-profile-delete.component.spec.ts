import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteProfileModalProfileDeleteComponent } from './athlete-profile-modal-profile-delete.component';

describe('AthleteProfileModalProfileDeleteComponent', () => {
  let component: AthleteProfileModalProfileDeleteComponent;
  let fixture: ComponentFixture<AthleteProfileModalProfileDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteProfileModalProfileDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteProfileModalProfileDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
