import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpPermissionsComponent } from './emp-permissions.component';

describe('EmpPermissionsComponent', () => {
  let component: EmpPermissionsComponent;
  let fixture: ComponentFixture<EmpPermissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpPermissionsComponent]
    });
    fixture = TestBed.createComponent(EmpPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
