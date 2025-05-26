import { Component, OnInit } from '@angular/core';
import { courseDTO } from 'src/app/Interface/courseDTO';
import { CourseService } from 'src/app/services/course.service/course.service';
@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css'],
})
export class LearningComponent implements OnInit {
  courses: courseDTO[] = []; // 全部課程
  filteredCourses: courseDTO[] = []; // 搜尋後結果
  searchText: string = '';

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((data) => {
      this.courses = data;
      this.filteredCourses = data;
    });
  }
  onSearch(): void {
    const keyword = this.searchText.toLowerCase().trim();

    this.filteredCourses = this.courses.filter(
      (course) =>
        course.title.toLowerCase().includes(keyword) ||
        course.description.toLowerCase().includes(keyword) ||
        course.companyName?.toLowerCase().includes(keyword)
    );
  }
}
