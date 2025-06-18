import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultService } from 'src/app/Share/result.service';

@Injectable({
  providedIn: 'root'
})
export class CourseAccessServiceService {

  constructor(private result: ResultService) { }
  CourseBgListAllEmployeeUrl = "https://localhost:7274/api/CourseBgList/employee"
  CourseAccessUrl = "https://localhost:7274/api/CourseAccess"
  DepUrl = "https://localhost:7274/api/DepList"
  // 獲取所有員工 + 是否有該課程權限
  getAllEmployeeWithAccess(courseId: number): Observable<any> {
    return this.result.getResult(`${this.CourseBgListAllEmployeeUrl}`);
  }

  // 獲取該課程的所有使用者權限資料（非必要）
  getCourseAccess(courseId: number): Observable<any> {
    return this.result.getResult(`${this.CourseAccessUrl}/${courseId}`);
  }

  // 新增一筆 User 的課程權限
  postUserCourseAccess(courseId: number, userId: number): Observable<any> {
    return this.result.postResult(`${this.CourseAccessUrl}/addUserAccess`, {
      courseId,
      userId
    });
  }

  // 刪除一筆課程權限
  delUserCourseAccess(courseAccessId: number): Observable<any> {
    return this.result.delResult(`${this.CourseAccessUrl}/${courseAccessId}`);
  }

  // 獲取部門資料
  getDepList(): Observable<any> {
    return this.result.getResult(this.DepUrl);
  }

  // 批次新增：依部門授權課程權限
  postDepartmentAccess(courseId: number, depIds: number[]): Observable<any> {
    return this.result.postResult(`${this.CourseAccessUrl}`, {
      courseId,
      depIds
    });
  }


}
