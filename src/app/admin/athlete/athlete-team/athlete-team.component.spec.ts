import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteTeamComponent } from './athlete-team.component';

describe('AthleteTeamComponent', () => {
  let component: AthleteTeamComponent;
  let fixture: ComponentFixture<AthleteTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
