import { Component, Input } from '@angular/core';
import { courseDTO } from 'src/app/Interface/courseDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent {
  @Input() course!: courseDTO; // ✅ 一定要有這行


  constructor(private router: Router) { }

  goToDetail(): void {
    sessionStorage.setItem('selectedCourse', JSON.stringify(this.course));
    this.router.navigate(['/home/course-products/detail']);
  }








}
