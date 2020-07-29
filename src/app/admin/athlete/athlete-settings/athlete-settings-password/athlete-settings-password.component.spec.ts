import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteSettingsPasswordComponent } from './athlete-settings-password.component';

describe('AthleteSettingsPasswordComponent', () => {
  let component: AthleteSettingsPasswordComponent;
  let fixture: ComponentFixture<AthleteSettingsPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteSettingsPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteSettingsPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
