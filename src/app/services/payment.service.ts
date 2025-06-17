import { ApiResponse } from './../Share/interface/resultDTO';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { CourseDto } from 'src/app/Interface/courseDTO';
import { LinePayRequestInfo } from '../Interface/linepay';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private url = 'https://localhost:7274/api/linepay'; // 或你後端的 base path
  private base = '/linepay';

  constructor(private http: HttpClient) {}

  requestPayment(cartItems: CourseDto[]): Observable<ApiResponse<LinePayRequestInfo>> {
    return this.http.post<ApiResponse<LinePayRequestInfo>>(
      `${this.url}/request`,
      cartItems
    );
  }

  confirmPayment(orderId: string, transactionId: string)
    : Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('orderId', orderId)
      .set('transactionId', transactionId);
    return this.http.get<ApiResponse<any>>(
      `${this.base}/confirm`, { params }
    );
  }

  getOwnCourses(): Observable<number[]> {
  return this.http
    .get<ApiResponse<number[]>>('https://localhost:7274/api/Users/own-courses')
    .pipe(
      map(res => res.data ?? []),
      catchError(() => of([]))
    );
}

}
