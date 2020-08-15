import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachSettingsPasswordComponent } from './coach-settings-password.component';

describe('CoachSettingsPasswordComponent', () => {
  let component: CoachSettingsPasswordComponent;
  let fixture: ComponentFixture<CoachSettingsPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachSettingsPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachSettingsPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
