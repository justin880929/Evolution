import { catchError, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap, throwError, of, BehaviorSubject } from 'rxjs';
import { ResultService } from "../Share/result.service";
import { JWTService } from '../Share/JWT/jwt.service';
interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  username: string;
  role: string;
}
export interface UserIdentity {
  username: string,
  role: string
}
@Injectable({ providedIn: 'root' })
export class AuthService {

  private useMock = true; // ✅ true = 使用 mock，不呼叫後端

  private authUrl = 'https://localhost:7274/api/auth';       // ✅ 用於 login
  private accountUrl = 'https://localhost:7274/api/account'; // ✅ 用於 reset-password 與 forgot-password
  private fakeResponse: ApiResponse<AuthResponseDto> = {
  success: true,
  message: 'Mock 登入成功',
  statusCode: 200,
  data: {
    // 直接貼入你提供的 JWT（裡面已有 sub、name、role=Admin 等 claim）
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlRvbW15IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJqdGkiOiI5OWZlNTkyNS03YTg5LTQ3ZjQtOWU5Zi1kMmUxNzc2NmFiOWQiLCJleHAiOjE3NDg1MzIwNDEsImlzcyI6Ik15TGVhcm5pbmdTaXRlIiwiYXVkIjoiTXlMZWFybmluZ1NpdGVVc2VycyJ9.N32WV57a-ValRIp9Kh10_jspdenPKIGiApBcpa51RjA',
    // 模擬的 refresh token
    refreshToken: 'mock-refresh-token',
    // 以秒為單位的有效時間 (若你後端設定 AccessTokenExpirationMinutes = 60，這裡就填 3600)
    expiresIn: 3600
  }
};

// 1. 新增：BehaviorSubject 管理登入狀態
  private _loggedIn$$ = new BehaviorSubject<boolean>(!!localStorage.getItem('jwt'));
  // 2. 暴露為 Observable 供 component 訂閱
  public isLoggedIn$ = this._loggedIn$$.asObservable();

  constructor(private http: HttpClient, private resultService: ResultService, private jwtService: JWTService) { }

  login(email: string, password: string): Observable<UserIdentity | null> {
    if (this.useMock) {
      this.jwtService.setToken(this.fakeResponse.data.accessToken)
      localStorage.setItem('refreshToken', this.fakeResponse.data.refreshToken);
      this._loggedIn$$.next(true);
      const user = this.jwtService.UnpackJWT();
      console.log('Mock 登入 user:', user); // ✅ 加這行檢查
      return of(user);// 回傳解碼後的身分資料
    } else {
      return this.resultService.postResult<AuthResponseDto>(`${this.authUrl}/login`, { email, password })
        .pipe(
          tap(res => {
            // 1. 存 accessToken
            this.jwtService.setToken(res.accessToken);
            // 2. 存 refreshToken
            localStorage.setItem('refreshToken', res.refreshToken);
            // 3. 廣播已登入
            this._loggedIn$$.next(true);
          }),
          map(() => this.jwtService.UnpackJWT()),
        catchError(err => throwError(() => err))
      );
    }

  }

  sendResetLink(email: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      'https://localhost:7274/api/Account/forgot-password',
      { email }
    );
  }

  resetPassword(data: ResetPasswordDTO): Observable<ApiResponse<ResetPasswordResponse>> {
    return this.http.post<ApiResponse<ResetPasswordResponse>>(`${this.accountUrl}/reset-password`, data);
  }

  /** ✅ 登出 */
  logout(): Observable<ApiResponse<string>> {
  if (this.useMock) {
    this.jwtService.clearToken();
    localStorage.removeItem('refreshToken');
    this._loggedIn$$.next(false);
    return of({
      success: true,
      message: 'Mock 登出成功',
      statusCode: 200,
      data: 'mock-logout'
    });
  }

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    // 沒有 refreshToken，就直接模擬回傳一個成功的 ApiResponse
    this.jwtService.clearToken();
    this._loggedIn$$.next(false);
    return of({
      success: true,
      message: '無 refresh token，已本地登出',
      statusCode: 200,
      data: ''
    });
  }

  return this.http
    .post<ApiResponse<string>>(
      `${this.authUrl}/logout`,
      { refreshToken }
    )
    .pipe(
      finalize(() => {
        // 無論成功或失敗，都清掉本地 token 並廣播登出
        this.jwtService.clearToken();
        localStorage.removeItem('refreshToken');
        this._loggedIn$$.next(false);
      })
    );
}
}
