import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseProductsComponent } from './course-products.component';

describe('CourseProductsComponent', () => {
  let component: CourseProductsComponent;
  let fixture: ComponentFixture<CourseProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseProductsComponent]
    });
    fixture = TestBed.createComponent(CourseProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
