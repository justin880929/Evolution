import { catchError, finalize, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap, throwError, of } from 'rxjs';
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
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlRvbW15IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJqdGkiOiIyMTE3NDJkMy00OGZkLTQwMDktYmIyNS00NWVhNmFkYWRiNzYiLCJleHAiOjE3NDg2MTA2NTcsImlzcyI6Ik15TGVhcm5pbmdTaXRlIiwiYXVkIjoiTXlMZWFybmluZ1NpdGVVc2VycyJ9.S8wFpzh817DdSAGTx-e8DFeCLnOacmiBPmkUb-BceEs',
      refreshToken: '95ee1361dbd043278b3361084d9d94f7NzG27EiuRaCIKsd8d6deuNjk6Ay/N/bSZDh7VqBEctA=',
      expiresIn: 3600
    }
  };

  constructor(private http: HttpClient, private resultService: ResultService, private jwtService: JWTService) { }

  login(email: string, password: string): Observable<UserIdentity | null> {
    if (this.useMock) {
      this.jwtService.setToken(this.fakeResponse.data.accessToken, this.fakeResponse.data.refreshToken)
      const user = this.jwtService.UnpackJWT();
      console.log('Mock 登入 user:', user); // ✅ 加這行檢查
      return of(user);// 回傳解碼後的身分資料
    } else {
      return this.resultService.postResult<AuthResponseDto>(`${this.authUrl}/login`, { email, password })
        .pipe(
          tap(res => {
            this.jwtService.setToken(res.accessToken, res.refreshToken);
          }),
          map(() => {
            const user = this.jwtService.UnpackJWT();
            return user;// 回傳解碼後的身分資料
          }),
          catchError(err => {
            return throwError(() => err);
          })
        );
    }

  }

  sendResetLink(email: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      'https://localhost:7274/api/Account/forgot-password',
      { email }
    );
  }
  refreshToken() {
    const rt = localStorage.getItem('refresh_token')!;
    return this.resultService
      .postResult<AuthResponseDto>(`${this.authUrl}/refresh`, { refreshToken: rt })
      // .postResult<AuthResponseDto>(`${this.authUrl}/refresh`, { Authorization: `Bearer ${rt}` })
      .pipe(
        tap(res => {
          // 更新新的 access & refresh token
          console.log("setNewToken");
          this.jwtService.setToken(res.accessToken, res.refreshToken);
        }),
        catchError(err => {
          return throwError(() => err)
        })
      );
  }
  resetPassword(data: ResetPasswordDTO): Observable<ApiResponse<ResetPasswordResponse>> {
    return this.http.post<ApiResponse<ResetPasswordResponse>>(`${this.accountUrl}/reset-password`, data);
  }

  /** ✅ 登出 */
  logout(): Observable<ApiResponse<string>> {
    if (this.useMock) {
      // 清除邏輯不應寫在 service，應交由 component 控制
      return of({
        success: true,
        message: 'Mock 登出成功',
        statusCode: 200,
        data: 'mock-logout'
      });
    }

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return of(); // 無 refreshToken 也不送出請求

    return this.http.post<ApiResponse<string>>(`${this.authUrl}/logout`, {
      refreshToken
    }).pipe(finalize(() => {
      this.jwtService.clearToken();
    }));
  }

}
