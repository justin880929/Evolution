import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from './interface/resultDTO';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RePutDTO } from '../Interface/createCourseDTO';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  constructor(private http: HttpClient) {}
  getResult<T>(url: string): Observable<T> {
    return this.http.get<ApiResponse<T>>(url).pipe(
      map((response) => {
        if (response.success || response.statusCode === 200) {
          return response.data as T;
        } else {
          throw {
            statusCode: response.statusCode,
            message: response.message,
          };
        }
      }),
      catchError((error) => {
        let errMessage = '系統錯誤';
        let statusCode = 500;
        const responseError = error?.error;
        if (error.status !== 0 && responseError) {
          errMessage = responseError.message;
          statusCode = responseError.statusCode;
        }
        console.error('API 錯誤：', statusCode, errMessage);
        return throwError(() => ({ statusCode, message: errMessage }));
      })
    );
  }

  postResult<T>(url: string, body: Object): Observable<T> {
    return this.http.post<ApiResponse<T>>(url, body).pipe(
      map((response) => {
        if (response.success || response.statusCode === 200) {
          return response.data as T;
        } else {
          throw {
            statusCode: response.statusCode,
            message: response.message,
          };
        }
      }),
      catchError((error) => {
        let errMessage = '系統錯誤';
        let statusCode = 500;
        const responseError = error?.error;
        if (error.status !== 0) {
          errMessage = responseError.message;
          statusCode = responseError.statusCode;
        }
        console.log('經過API統一處理');
        console.error('API 錯誤：', statusCode, errMessage);
        return throwError(() => ({ statusCode, message: errMessage }));
      })
    );
  }
  putResult<T>(url: string, body: object): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(url, body).pipe(
      catchError((error) => {
        let errMessage = '系統錯誤';
        let statusCode = 500;
        const responseError = error?.error;
        if (error.status !== 0) {
          errMessage = responseError.message;
          statusCode = responseError.statusCode;
        }
        console.error('API 錯誤：', statusCode, errMessage);
        return throwError(() => ({ statusCode, message: errMessage }));
      })
    );
  }

  delResult(url: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(url).pipe(
      catchError((error) => {
        let errMessage = '系統錯誤';
        let statusCode = 500;
        const responseError = error?.error;
        if (error.status !== 0) {
          errMessage = responseError.message;
          statusCode = responseError.statusCode;
        }
        console.error('API 錯誤：', statusCode, errMessage);
        return throwError(() => ({ statusCode, message: errMessage }));
      })
    );
  }
}
