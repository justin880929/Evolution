import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { empDTO } from '../../Interface/empDTO';
import { MOCK_EMPLOYEES } from '../../mock/mock-emp';

@Injectable({
  providedIn: 'root',
})
export class EmpService {
  private useMock = true;

  constructor(private http: HttpClient) { }

  /**
   * ✅ 模擬取得所有資料（如需 client-side 處理時使用）
   */
  private fetchData(): Observable<empDTO[]> {
    return this.useMock
      ? of(MOCK_EMPLOYEES)
      : this.http.get<empDTO[]>('https://your-api/employees');
  }

  /**
   * ✅ 回傳所有資料
   */
  getAll(): Observable<empDTO[]> {
    return this.fetchData();
  }

  /**
   * ✅ 取得前五筆
   */
  getTop5(): Observable<empDTO[]> {
    return this.fetchData().pipe(map(data => data.slice(0, 5)));
  }

  /**
   * ✅ 依 ID 查單筆資料
   */
  getById(id: number): Observable<empDTO | undefined> {
    return this.fetchData().pipe(map(data => data.find(e => e.userID === id)));
  }

  /**
   * ✅ 模擬 Lazy loading 分頁
   * @param startIndex 分頁起始索引（例如第2頁開始就是 10）
   * @param pageSize 每頁資料筆數
   */
  getPaged(startIndex: number, pageSize: number): Observable<empDTO[]> {
    if (this.useMock) {
      const page = MOCK_EMPLOYEES.slice(startIndex, startIndex + pageSize);
      return of(page);
    } else {
      // ⚠️ 未來串 API 請改成呼叫對應分頁 API
      const url = `https://your-api/employees?start=${startIndex}&size=${pageSize}`;
      return this.http.get<empDTO[]>(url);
    }
  }

  /**
   * ✅ 回傳總筆數（提供給 table.totalRecords）
   */
  getTotalCount(): number {
    return MOCK_EMPLOYEES.length;
  }
}
