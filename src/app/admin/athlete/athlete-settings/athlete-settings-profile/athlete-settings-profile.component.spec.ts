import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteSettingsProfileComponent } from './athlete-settings-profile.component';

describe('AthleteSettingsProfileComponent', () => {
  let component: AthleteSettingsProfileComponent;
  let fixture: ComponentFixture<AthleteSettingsProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteSettingsProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteSettingsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
