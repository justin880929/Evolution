import { ConfigService } from '../config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, throwError } from 'rxjs';
import { CourseDto } from 'src/app/Interface/courseDTO';
import { MOCK_COURSES } from 'src/app/mock/mock-courses';
import { ApiResponse } from 'src/app/Share/interface/resultDTO';
import { PagedResult } from 'src/app/Interface/pagedResult';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private baseUrl = 'https://localhost:7274/api/courses';

  constructor(private http: HttpClient,private configService : ConfigService) { }

  /** ✅ 取得所有課程 */
 getCoursesPaged(pageIndex: number, pageSize: number) {
  return this.http.get<ApiResponse<PagedResult<CourseDto>>>(
    `${this.baseUrl}/paged`,
    {
      params: {
        pageIndex: pageIndex.toString(),
        pageSize:  pageSize.toString()
      }
    }
  );
}

  /** ✅ 取得指定課程（含 null 處理） */
  getCourseById(id: number): Observable<CourseDto> {
    if (this.configService.useMock) {
      const course = MOCK_COURSES.find(c => c.courseId === id);
      return course
        ? of(course)
        : throwError(() => new Error('找不到該課程'));
    } else {
      return this.http
      .get<ApiResponse<CourseDto>>(`${this.baseUrl}/course/${id}`)
      .pipe(
        map(res =>{
          if(!res.success)
            throw new Error(res.message);
          if(!res.data)
            throw new Error("伺服器回傳資料為空的")
          return res.data;
        })
      )
    }
  }

}
