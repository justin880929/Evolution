import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { courseDTO } from 'src/app/Interface/courseDTO';
import { MOCK_COURSES } from 'src/app/mock/mock-courses';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private useMock = true; // ⬅️ true = 使用 mock，false = 使用 API

  constructor(private http: HttpClient) { }

  /** ✅ 取得所有課程 */
  getCourses(): Observable<courseDTO[]> {
    return this.useMock
      ? of(MOCK_COURSES)
      : this.http.get<courseDTO[]>('https://your-api/courses');
  }

  /** ✅ 取得指定課程 */
  getCourseById(id: number): Observable<courseDTO> {
    return this.useMock
      ? of(MOCK_COURSES.find(c => c.id === id)!)
      : this.http.get<courseDTO>(`https://your-api/courses/${id}`);
  }
}
