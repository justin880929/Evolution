import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './interface/resultDTO';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private http: HttpClient) {

  }
  postResult<T>(url: string, body: Object): Observable<T> {
    return this.http.post<ApiResponse<T>>(url, body).pipe(
      map(response => {
        if (response.success || response.statusCode === 200) {
          return response.data as T;
        } else {
          throw {
            statusCode: response.statusCode,
            message: response.message || response.errors?.join(', ') || '操作失敗'
          };
        }
      }),
      catchError(error => {
        const errMessage = '系統錯誤';
        const statusCode = error?.statusCode || error.status;
        console.error('API 錯誤：', statusCode, errMessage);
        return throwError(() => ({ statusCode, message: errMessage }));
      })
    );
  }
}
