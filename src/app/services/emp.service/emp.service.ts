// src/app/services/emp.service/emp.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { empDTO } from '../../Interface/empDTO';
import { MOCK_EMPLOYEES } from '../../mock/mock-emp';
import { FilterMetadata } from 'primeng/api';
import { ConfigService } from '../config.service';

interface PagedResult<T> {
  data: T[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmpService {

  private apiUrl = '/api/employees'; // 或你實際的 API 路徑

  private mockData: empDTO[] = [...MOCK_EMPLOYEES];

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  private fetchData(): Observable<empDTO[]> {
    return this.configService.useMock
      ? of(this.mockData)
      : this.http.get<empDTO[]>(`${this.apiUrl}`);
  }

  getAll(): Observable<empDTO[]> {
    return this.fetchData();
  }

  getById(id: number): Observable<empDTO | undefined> {
    if (this.configService.useMock) {
      return of(this.mockData.find(e => e.userID === id));
    }
    return this.http.get<empDTO>(`${this.apiUrl}/${id}`);
  }

  getPagedResult(
    startIndex: number,
    pageSize: number,
    sortField: string,
    sortOrder: number,
    filters: { [s: string]: FilterMetadata | FilterMetadata[] | undefined }
  ): Observable<{ data: empDTO[]; total: number }> {
    if (this.configService.useMock) {
      let data = [...this.mockData];

      // 1. 加上 statusLabel
      data = data.map(emp => ({
        ...emp,
        statusLabel: emp.isEmailConfirmed ? '已驗證' : '未驗證'
      }));

      // 2. 篩選
      Object.keys(filters).forEach(field => {
        const meta = filters[field];
        const rawValue = Array.isArray(meta) ? meta[0]?.value : meta?.value;
        const filterValue = (rawValue as string)?.toString().toLowerCase();

        if (filterValue) {
          data = data.filter(emp => {
            const cell = (emp as any)[field];
            return cell?.toString().toLowerCase().includes(filterValue);
          });
        }
      });

      const total = data.length;

      // 3. 排序
      if (sortField) {
        data.sort((a, b) => {
          const valA = (a as any)[sortField];
          const valB = (b as any)[sortField];
          if (valA == null || valB == null) return 0;
          if (valA > valB) return sortOrder;
          if (valA < valB) return -sortOrder;
          return 0;
        });
      }

      // 4. 分頁
      const paged = data.slice(startIndex, startIndex + pageSize);
      return of({ data: paged, total });
    }

    // 正式回後端
    let params = new HttpParams()
      .set('start', startIndex.toString())
      .set('limit', pageSize.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder.toString());

    Object.keys(filters).forEach(field => {
      const meta = filters[field];
      const rawValue = Array.isArray(meta) ? meta[0]?.value : meta?.value;
      if (rawValue) {
        params = params.set(`filter_${field}`, rawValue.toString());
      }
    });

    return this.http.get<{ data: empDTO[]; total: number }>(`${this.apiUrl}`, { params });
  }

  createEmployee(emp: empDTO): Observable<any> {
    if (this.configService.useMock) {
      const maxId = this.mockData.reduce((acc, cur) => Math.max(acc, cur.userID), 0);
      const newEmp = { ...emp, userID: maxId + 1 };
      this.mockData.push(newEmp);
      return of({ success: true, data: newEmp });
    }
    return this.http.post<any>(this.apiUrl, emp);
  }

  updateEmployee(emp: empDTO): Observable<any> {
    if (this.configService.useMock) {
      const idx = this.mockData.findIndex(e => e.userID === emp.userID);
      if (idx !== -1) {
        this.mockData[idx] = { ...emp };
        return of({ success: true, data: emp });
      } else {
        return of({ success: false, message: '找不到該筆假資料' });
      }
    }
    return this.http.put<any>(`${this.apiUrl}/${emp.userID}`, emp);
  }

  deleteEmployee(id: number): Observable<any> {
    if (this.configService.useMock) {
      this.mockData = this.mockData.filter(e => e.userID !== id);
      return of({ success: true });
    }
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  deleteEmployeesBulk(ids: number[]): Observable<any> {
    if (this.configService.useMock) {
      this.mockData = this.mockData.filter(e => !ids.includes(e.userID));
      return of({ success: true });
    }
    return this.http.post<any>(`${this.apiUrl}/bulk-delete`, { ids });
  }
}
