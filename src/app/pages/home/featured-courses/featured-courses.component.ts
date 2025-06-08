// featured-courses.component.ts
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CourseWithTagDto } from '../../../Interface/coursewithtagDTO';

@Component({
  selector: 'app-featured-courses',
  templateUrl: './featured-courses.component.html',
  styleUrls: ['./featured-courses.component.css']
})
export class FeaturedCoursesComponent {
  @Input() course!: CourseWithTagDto;
  constructor(private router: Router) {}

  // 如要在卡片內處理點擊細節，也可改放這裡
  goToDetail(): void {
    this.router.navigate(['/home/course-products/detail', this.course.courseId]);
  }
}
