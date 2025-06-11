import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedCoursesComponent } from './featured-courses.component';

describe('FeaturedCoursesComponent', () => {
  let component: FeaturedCoursesComponent;
  let fixture: ComponentFixture<FeaturedCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeaturedCoursesComponent]
    });
    fixture = TestBed.createComponent(FeaturedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
