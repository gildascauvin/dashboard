import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteSettingsLanguageComponent } from './athlete-settings-language.component';

describe('AthleteSettingsLanguageComponent', () => {
  let component: AthleteSettingsLanguageComponent;
  let fixture: ComponentFixture<AthleteSettingsLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteSettingsLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteSettingsLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
