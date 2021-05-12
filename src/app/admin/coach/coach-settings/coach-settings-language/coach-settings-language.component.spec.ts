import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachSettingsLanguageComponent } from './coach-settings-language.component';

describe('CoachSettingsProfileComponent', () => {
  let component: CoachSettingsLanguageComponent;
  let fixture: ComponentFixture<CoachSettingsLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachSettingsLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachSettingsLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
