import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoConnectComponent } from './auto-connect.component';

describe('AutoConnectComponent', () => {
  let component: AutoConnectComponent;
  let fixture: ComponentFixture<AutoConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoConnectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
