import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleNewMovementComponent } from './module-new-movement.component';

describe('ModuleNewMovementComponent', () => {
  let component: ModuleNewMovementComponent;
  let fixture: ComponentFixture<ModuleNewMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleNewMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleNewMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
