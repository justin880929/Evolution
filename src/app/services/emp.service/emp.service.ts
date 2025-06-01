import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { empDTO } from '../../Interface/empDTO';
import { MOCK_EMPLOYEES } from '../../mock/mock-emp';
import { FilterMetadata } from 'primeng/api';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class EmpService {

  constructor(private http: HttpClient,private configService: ConfigService) { }

  /**
   * ✅ 模擬取得所有資料（如需 client-side 處理時使用）
   */
  private fetchData(): Observable<empDTO[]> {
    return this.configService.useMock
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

  getPagedResult(
    startIndex: number,
    pageSize: number,
    sortField: string,
    sortOrder: number,
    filters: { [s: string]: FilterMetadata | FilterMetadata[] | undefined }
  ): Observable<{ data: empDTO[]; total: number }> {
    let result = [...MOCK_EMPLOYEES];

    // ✅ 加入 statusLabel 欄位 → 讓它能被篩選與排序
    result = result.map(emp => ({
      ...emp,
      statusLabel: emp.isEmailConfirmed ? '已驗證' : '未驗證'
    }));


    // 🔍 搜尋處理
    for (const field in filters) {
      const meta = filters[field];
      const rawValue = Array.isArray(meta) ? meta[0]?.value : meta?.value;

      const filterValue = Array.isArray(rawValue)
        ? rawValue[0]?.toLowerCase()
        : rawValue?.toLowerCase();

      if (filterValue) {
        result = result.filter(emp => {
          const val = (emp as any)[field]?.toString().toLowerCase();
          return val?.includes(filterValue);
        });
      }
    }

    const total = result.length;

    // ✅ 先加上 statusLabel 欄位（讓它也能排序）
    result = result.map(emp => ({
      ...emp,
      statusLabel: emp.isEmailConfirmed ? '已驗證' : '未驗證'
    }));

    // ✅ 所有欄位皆可排序（包含 statusLabel）
    if (sortField) {
      result.sort((a, b) => {
        const valA = (a as any)[sortField];
        const valB = (b as any)[sortField];
        if (valA == null || valB == null) return 0;
        return sortOrder * (valA > valB ? 1 : valA < valB ? -1 : 0);
      });
    }

    // 📄 分頁
    const page = result.slice(startIndex, startIndex + pageSize);

    return of({ data: page, total });
  }

}
