import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { JWTService } from '../JWT/jwt.service'; // 根據你的實際路徑調整
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor(private jwtService: JWTService, private router: Router, private auth: AuthService) { }
  private skipUrls = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/refresh',
    '/api/account/reset-password',
    '/api/account/forgot-password'
  ];
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url.toLowerCase();
    const shouldSkip = this.skipUrls.some(path => url.endsWith(path));
    const token = this.jwtService.getToken();

    const authReq = token && !shouldSkip
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;
    console.log('是否跳過：', shouldSkip);
    // console.log('Token：', token);
    console.log('是否應該 refresh：', this.jwtService.shouldRefreshTokenSoon());
    // ✅ 判斷是否需要 refresh
    if (!shouldSkip && this.jwtService.shouldRefreshTokenSoon()) {
      console.log('⚠️ 將呼叫 refreshToken()');
      return this.auth.refreshToken().pipe(
        switchMap(() => {
          const newToken = this.jwtService.getToken();
          const newReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
          return next.handle(newReq);
        }),

        catchError(error => this.handleAuthError(error, shouldSkip))
      );
    }

    // ✅ 直接送出請求
    return next.handle(authReq).pipe(
      catchError(error => this.handleAuthError(error, shouldSkip))
    );
  }

  private handleAuthError(error: HttpErrorResponse, shouldSkip: boolean): Observable<never> {
    if (error.status === 401 && !shouldSkip) {
      console.warn('🔒 401 Unauthorized，清除 token 並導回 /login');
      this.jwtService.clearToken();
      this.router.navigate(['/login']);
    }
    return throwError(() => {
      console.log(error);
      return error
    });
  }

}
