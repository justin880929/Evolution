import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap, throwError } from 'rxjs';
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
  private authUrl = 'https://localhost:7274/api/auth';       // ✅ 用於 login
  private accountUrl = 'https://localhost:7274/api/account'; // ✅ 用於 reset-password 與 forgot-password


  constructor(private http: HttpClient, private resultService: ResultService, private jwtService: JWTService) { }

  login(email: string, password: string): Observable<UserIdentity | null> {
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

  sendResetLink(email: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      'https://localhost:7274/api/Account/forgot-password',
      { email }
    );
  }

  resetPassword(data: ResetPasswordDTO): Observable<ApiResponse<ResetPasswordResponse>> {
    return this.http.post<ApiResponse<ResetPasswordResponse>>(`${this.accountUrl}/reset-password`, data);
  }


}
