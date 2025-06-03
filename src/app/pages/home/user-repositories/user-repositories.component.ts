import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service/course.service';
import { JWTService } from './../../../Share/JWT/jwt.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-user-repositories',
  templateUrl: './user-repositories.component.html',
  styleUrls: ['./user-repositories.component.css'],
})
export class UserRepositoriesComponent implements OnInit {
  searchKeyword: string = '';
  filteredCourses: any[] = [];
  allCourses: any[] = [];
  UserName: string | null | undefined = null;

  constructor(
    private router: Router,
    private jwTService: JWTService,
    private courseService: CourseService
  ) {}

  searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.UserName = this.jwTService.UnpackJWT()?.username;

    this.courseService.getCourses().subscribe((data) => {
      this.allCourses = data;
      this.filteredCourses = [...this.allCourses];
    });

    this.searchSubject.pipe(debounceTime(300)).subscribe((query) => {
      this.applyFilter(query);
    });
  }
  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  applyFilter(query: string) {
    const keyword = query.toLowerCase().trim();

    if (!keyword) {
      this.filteredCourses = [...this.allCourses];
      return;
    }

    this.filteredCourses = this.allCourses.filter((course) =>
      ['title', 'company', 'description', 'price', 'img'].some((field) =>
        String(course[field]).toLowerCase().includes(keyword)
      )
    );
  }

  onClear() {
    this.filteredCourses = [...this.allCourses];
  }

  gotoLearning() {
    this.router.navigate(['/home/learning', 1]);
  }
}
