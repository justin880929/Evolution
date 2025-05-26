import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/services/course.service/course.service';
import { courseDTO } from 'src/app/Interface/courseDTO';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: courseDTO | null = null;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // 假設你有一個根據 ID 取得課程資料的方法
      this.courseService.getCourseById(+id).subscribe(data => {
        this.course = data;
      });
    }
  }
}
