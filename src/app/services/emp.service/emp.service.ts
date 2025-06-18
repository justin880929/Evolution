// src/app/services/emp.service/emp.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { empDTO } from '../../Interface/empDTO';
import { MOCK_EMPLOYEES } from '../../mock/mock-emp';
import { FilterMetadata } from 'primeng/api';
import { ConfigService } from '../config.service';
import { EmployeesListDto } from 'src/app/Interface/employeesListDTO';
import { ApiResponse } from 'src/app/Share/interface/resultDTO';
import { RegisteremployeeDTO } from 'src/app/Interface/RegisteremployeeDTO';

interface PagedResult<T> {
  data: T[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmpService {

  private baseUrl = 'https://localhost:7274/api/CompanyManage';
  private mockData: empDTO[] = [...MOCK_EMPLOYEES];

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  private fetchData(): Observable<empDTO[]> {
    return this.configService.useMock
      ? of(this.mockData)
      : this.http.get<empDTO[]>(`${this.baseUrl}`);
  }

  getAll(): Observable<empDTO[]> {
    return this.fetchData();
  }

  getById(id: number): Observable<empDTO | undefined> {
    if (this.configService.useMock) {
      return of(this.mockData.find(e => e.userID === id));
    }
    return this.http.get<empDTO>(`${this.baseUrl}/${id}`);
  }

  getPagedResult(
  startIndex: number,
  pageSize: number,
  sortField: string,
  sortOrder: number,
  filters: { [s: string]: FilterMetadata | FilterMetadata[] | undefined }
): Observable<{ data: EmployeesListDto[]; total: number }> {
  // 1. 排序參數，預設 userId、-1（DESC）
  const field = sortField || 'userId';
  const order = sortOrder ?? -1;

  // 2. 建立 HttpParams
  let params = new HttpParams()
    .set('start', startIndex.toString())
    .set('limit', pageSize.toString())
    .set('sortField', field)
    .set('sortOrder', order.toString());

  // 3. 對應前端欄位到後端 filter 名稱
  const filterKeyMap: Record<string, string> = {
    userId: 'userId',
    username: 'userName',
    email: 'email',
    userDep: 'userDep',
    userStatus: 'userStatus'
  };

  // 4. 處理 filters
  Object.entries(filters).forEach(([f, meta]) => {
    const backendKey = filterKeyMap[f];
    if (!backendKey) {
      return; // 無對應，就跳過
    }

    // 取出 filter value
    let raw = Array.isArray(meta) ? meta[0]?.value : meta?.value;
    if (raw == null || raw.toString().trim() === '') {
      return;
    }

    // 加入 query string
    params = params.set(
      `filter_${backendKey}`,
      raw.toString()
    );
  });

  // 5. 發出 GET 請求
  return this.http
    .get<ApiResponse<{ data: EmployeesListDto[]; total: number }>>(
      `${this.baseUrl}/employeesList`,
      { params }
    )
    .pipe(
      map(res => {
        if (!res.success) {
          throw new Error(res.message ?? '未知錯誤');
        }
        if (!res.data) {
          throw new Error('回傳資料為空');
        }
        // 回傳後端真實的 shape
        return {
          data: res.data.data,
          total: res.data.total
        };
      }),
      catchError(err => throwError(() => err))
    );
}

  createEmployee(emp: RegisteremployeeDTO) {
    return this.http
        .post<ApiResponse<EmployeesListDto>>(this.baseUrl, emp)
        .pipe(catchError(err => throwError(() => err)));
    }

  updateEmployee(emp: EmployeesListDto) {
    return this.http
          .put<ApiResponse<EmployeesListDto>>(
            `${this.baseUrl}/${emp.userId}`,
            emp
          )
          .pipe(catchError(err => throwError(() => err)));
      }

  deactivateEmployee(id: number): Observable<boolean> {
    const url = `${this.baseUrl}/${id}/status`;
    return this.http
      .delete<ApiResponse<void>>(url)
      .pipe(
        map(res => res.success),        // 只要 success=true 就回 true
        catchError(err => {
          console.error('停用員工失敗', err);
          return of(false);            // 失敗時回 false
        })
      );
  }

  deactivateEmployeesBulk(ids: number[]): Observable<boolean> {
    if (!ids.length) {
      // 若沒選任何人，直接回 false
      return of(false);
    }
    const url = `${this.baseUrl}/batch/status`;
    return this.http
      .post<ApiResponse<void>>(url, ids)
      .pipe(
        map(res => res.success),
        catchError(err => {
          console.error('批次停用員工失敗', err);
          return of(false);
        })
      );
  }

  deactivate(ids: number|number[]): Observable<boolean> {
    return Array.isArray(ids)
      ? this.deactivateEmployeesBulk(ids)
      : this.deactivateEmployee(ids);
  }
}
