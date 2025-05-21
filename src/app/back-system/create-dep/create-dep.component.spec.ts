import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDepComponent } from './create-dep.component';

describe('CreateDepComponent', () => {
  let component: CreateDepComponent;
  let fixture: ComponentFixture<CreateDepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateDepComponent]
    });
    fixture = TestBed.createComponent(CreateDepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
