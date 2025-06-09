import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError }       from 'rxjs';
import { map, catchError }              from 'rxjs/operators';
import { ApiResponse}     from './../Share/interface/resultDTO';    // <-- 加上 PagedResult
import { CompanyListDTO }               from './../Interface/companyListDTO';
import { FilterMetadata }               from 'primeng/api';


interface PagedResult<T> {
  items: T[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private baseUrl = 'https://localhost:7274/api/Publisher';

  constructor(private http: HttpClient){}

  /** 取得分頁資料 (Component 直接拿 { data, total }) */
  getClientPageData(
  startIndex: number,
  pageSize:   number,
  sortField:  string | null = 'createdAt',
  sortOrder:  number | null = -1,
  filters:    Record<string, FilterMetadata | FilterMetadata[] | undefined> = {}
): Observable<{ data: CompanyListDTO[]; total: number }> {
  const field = sortField ?? 'createdAt';
  const order = sortOrder ?? -1;

  let params = new HttpParams()
    .set('start',      startIndex.toString())
    .set('limit',      pageSize.toString())
    .set('sortField',  field)
    .set('sortOrder',  order.toString());

  Object.entries(filters).forEach(([f, meta]) => {
    let raw = Array.isArray(meta) ? meta[0]?.value : meta?.value;
    if (f === 'isActiveLabel' && typeof raw === 'string') {
    if (raw === '啟用') raw = 'true';
    else if (raw === '停用') raw = 'false';
    else return; // 如果輸入非啟用/停用就不送出參數
    params = params.set('filter_isActive', raw);
    } else if (raw != null && raw.toString() !== '') {
      params = params.set(`filter_${f}`, raw.toString());
    }
  });

  return this.http
    // 1) 把泛型改成後端真實回傳的 shape
    .get<ApiResponse<{ data: CompanyListDTO[]; total: number }>>(
      `${this.baseUrl}/client`,
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
        // 1) 用 res.data.data 而不是 res.data.items
        return {
          data:  res.data.data,   // <— 這裡
          total: res.data.total
        };
      }),
      catchError(err => throwError(() => err))
    );
}

  /** 新增客戶：POST /api/Publisher */
  createClient(client: CompanyListDTO) {
    return this.http
      .post<ApiResponse<CompanyListDTO>>(this.baseUrl, client)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** 更新客戶：PUT /api/Publisher/{id} */
  updateClient(client: CompanyListDTO) {
    return this.http
      .put<ApiResponse<CompanyListDTO>>(
        `${this.baseUrl}/${client.companyId}`,
        client
      )
      .pipe(catchError(err => throwError(() => err)));
  }

  /** 刪除單一客戶：DELETE /api/Publisher/{id} */
  deleteClient(id: number) {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** 批次刪除：POST /api/Publisher/batch */
  deleteClientsBulk(ids: number[]) {
    return this.http
      .post<ApiResponse<void>>(`${this.baseUrl}/batch`, ids)
      .pipe(catchError(err => throwError(() => err)));
  }
}
