import { courseDTO } from "src/app/Interface/courseDTO";
import { MOCK_COURSES } from "src/app/mock/mock-courses";
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor() { }

  getCourses(): Observable<courseDTO[]> {
    return of(MOCK_COURSES);
  }
}
