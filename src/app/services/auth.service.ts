import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class AuthService {

  private useMock = true; // ✅ true = 使用 mock，不呼叫後端

  private authUrl = 'https://localhost:7274/api/auth';       // ✅ 用於 login
  private accountUrl = 'https://localhost:7274/api/account'; // ✅ 用於 reset-password 與 forgot-password


  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<ApiResponse<AuthResponseDto>> {

    if (this.useMock) {
      const fakeResponse: ApiResponse<AuthResponseDto> = {
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
      return of(fakeResponse);
    }


    return this.http.post<ApiResponse<AuthResponseDto>>(`${this.authUrl}/login`, {
      email,
      password
    });
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
