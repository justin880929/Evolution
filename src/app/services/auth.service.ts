import { catchError } from 'rxjs/operators';
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
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxIiwibmFtZWlkIjoiMSIsInVuaXF1ZV9uYW1lIjoiSm9oblVzZXIiLCJyb2xlIjoiQWRtaW4iLCJqdGkiOiJtb2NrLXRva2VuLWlkIn0.' +
        'MOCK_SIGNATURE',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600
    }
  };

  constructor(private http: HttpClient, private resultService: ResultService, private jwtService: JWTService) { }

  login(email: string, password: string): Observable<UserIdentity | null> {
    if (this.useMock) {
      this.jwtService.setToken(this.fakeResponse.data.accessToken)
      const user = this.jwtService.UnpackJWT();
      console.log('Mock 登入 user:', user); // ✅ 加這行檢查
      return of(user);// 回傳解碼後的身分資料
    } else {
      return this.resultService.postResult<AuthResponseDto>(`${this.authUrl}/login`, { email, password })
        .pipe(
          tap(res => {
            this.jwtService.setToken(res.accessToken);
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

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return of(); // 無 refreshToken 也不送出請求

    return this.http.post<ApiResponse<string>>(`${this.authUrl}/logout`, {
      refreshToken
    });
  }

}
