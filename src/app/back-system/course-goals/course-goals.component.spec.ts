import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseGoalsComponent } from './course-goals.component';

describe('CourseGoalsComponent', () => {
  let component: CourseGoalsComponent;
  let fixture: ComponentFixture<CourseGoalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseGoalsComponent]
    });
    fixture = TestBed.createComponent(CourseGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
