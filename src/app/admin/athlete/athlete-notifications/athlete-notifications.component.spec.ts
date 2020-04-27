import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteNotificationsComponent } from './athlete-notifications.component';

describe('AthleteNotificationsComponent', () => {
  let component: AthleteNotificationsComponent;
  let fixture: ComponentFixture<AthleteNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
