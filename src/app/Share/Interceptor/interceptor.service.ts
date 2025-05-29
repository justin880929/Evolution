import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { JWTService } from '../JWT/jwt.service'; // 根據你的實際路徑調整
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor(private jwtService: JWTService, private router: Router) { }
  private skipUrls = [
    '/api/auth/login',
    '/api/auth/refresh',
    '/api/auth/logout',
    '/api/account/reset-password',
    '/api/account/forgot-password'
  ];
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url.toLowerCase();
    const shouldSkip = this.skipUrls.some(path => url.includes(path));

    // 正確的 Bearer 插值：使用反引號
    const token = this.jwtService.getToken();
    const authReq = token && !shouldSkip ?
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // 只有非 skipUrls 的 401 才跳轉
        if (error.status === 401 && !shouldSkip) {
          console.warn('🔒 401 Unauthorized，清除 token 並導回 /login');
          this.jwtService.clearToken();
          this.router.navigate(['/login']);
        }
        // login 那支 401 就會直接丟給 component 的 subscribe.error
        return throwError(() => error);
      })
    );
  }
}
