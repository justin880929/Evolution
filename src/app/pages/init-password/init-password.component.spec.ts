import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitPasswordComponent } from './init-password.component';

describe('InitPasswordComponent', () => {
  let component: InitPasswordComponent;
  let fixture: ComponentFixture<InitPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InitPasswordComponent]
    });
    fixture = TestBed.createComponent(InitPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
