import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountNotConfirmedComponent } from './account-not-confirmed.component';

describe('AccountNotConfirmedComponent', () => {
  let component: AccountNotConfirmedComponent;
  let fixture: ComponentFixture<AccountNotConfirmedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountNotConfirmedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountNotConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
