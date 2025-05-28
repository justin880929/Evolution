import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
            message: response.message
          };
        }
      }),
      catchError(error => {
        let errMessage = '系統錯誤';
        let statusCode = 500;
        const responseError = error?.error;
        if (error.status !== 0) {
          errMessage = responseError.message
          statusCode = responseError.statusCode
        }
        console.error('API 錯誤：', statusCode, errMessage);
        return throwError(() => ({ statusCode, message: errMessage }));
      })
    );
  }
}
