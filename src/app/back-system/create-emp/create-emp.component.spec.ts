import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmpComponent } from './create-emp.component';

describe('CreateEmpComponent', () => {
  let component: CreateEmpComponent;
  let fixture: ComponentFixture<CreateEmpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEmpComponent]
    });
    fixture = TestBed.createComponent(CreateEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
