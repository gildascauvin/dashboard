import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachSettingsProfileComponent } from './coach-settings-profile.component';

describe('CoachSettingsProfileComponent', () => {
  let component: CoachSettingsProfileComponent;
  let fixture: ComponentFixture<CoachSettingsProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachSettingsProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachSettingsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
