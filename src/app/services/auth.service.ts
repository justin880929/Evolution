import { PaymentService } from './payment.service';
import { CartService } from './cart.service';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap, throwError, of, BehaviorSubject } from 'rxjs';
import { ResultService } from "../Share/result.service";
import { JWTService } from '../Share/JWT/jwt.service';
import { ConfigService } from './config.service';
import { UserService } from './user.service';
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

  private storageKey = 'own-courses';
  ownCourses: number[] = []; // 用來存放使用者的課程 ID
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

  constructor(private http: HttpClient, private resultService: ResultService, private jwtService: JWTService, private configService: ConfigService, private userService: UserService, private cartService: CartService, private paymentService: PaymentService) { }
  private _loggedIn$$ = new BehaviorSubject<boolean>(!!localStorage.getItem('jwt'));
  public isLoggedIn$ = this._loggedIn$$.asObservable();
  login(email: string, password: string): Observable<UserIdentity | null> {
    // 先清空舊 Token
    this.jwtService.clearToken();

    if (this.configService.useMock) {
      this.jwtService.setToken(
        this.fakeResponse.data.accessToken,
        this.fakeResponse.data.refreshToken
      );
      // 把 userSubject.next(newUserDto) 的事情做一下
      this.userService.refreshUserInfo().subscribe();
      this._loggedIn$$.next(true);
      this.paymentService.getOwnCourses().subscribe({
        next: (courses: number[]) => {
          // courses 就已經是一個 number[]，直接指派＆存到 localStorage
          this.ownCourses = courses;
          localStorage.setItem(this.storageKey, JSON.stringify(courses));
        },
        error: err => {
          console.error(err);
          this.ownCourses = [];
          localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
      });
      return of(this.jwtService.UnpackJWT());
    } else {
      return this.resultService
        .postResult<AuthResponseDto>(`${this.authUrl}/login`, { email, password })
        .pipe(
          // 1. 先把 token 存好
          tap(res => {
            this.jwtService.setToken(res.accessToken, res.refreshToken);
          }),
          // 2. 然後載入使用者資料
          switchMap(() => {
            // refreshUserInfo 內部會推到 userSubject
            return this.userService.refreshUserInfo();  // 假設它回傳 Observable<UserDTO>
          }),
          // 3. 載完 userInfo 再通知已登入
          tap(() => {
            this._loggedIn$$.next(true);
            this.paymentService.getOwnCourses().subscribe({
              next: (courses: number[]) => {
                // courses 就已經是一個 number[]，直接指派＆存到 localStorage
                this.ownCourses = courses;
                localStorage.setItem(this.storageKey, JSON.stringify(courses));
              },
              error: err => {
                console.error(err);
                this.ownCourses = [];
                localStorage.setItem(this.storageKey, JSON.stringify([]));
              }
            });
          }),
          // 4. 最後回傳 JWT payload
          map(() => {
            return this.jwtService.UnpackJWT()!;
          }),
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

  initPassword(data: ResetPasswordDTO): Observable<ApiResponse<ResetPasswordResponse>> {
    return this.http.post<ApiResponse<ResetPasswordResponse>>(`${this.accountUrl}/init-password`, data);
  }

  /** ✅ 登出 */
  logout(): Observable<ApiResponse<string>> {
    console.log("logout");

    if (this.configService.useMock) {
      this.jwtService.clearToken();
      this._loggedIn$$.next(false);
      this.userService.clearUser();   // ← 清空 user$
      this.cartService.clearCart(); // 清空購物車
      return of({
        success: true,
        message: 'Mock 登出成功',
        statusCode: 200,
        data: 'mock-logout'
      });
    }

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      // 沒 Token 也要清
      this.jwtService.clearToken();
      this._loggedIn$$.next(false);
      this.userService.clearUser();
      this.cartService.clearCart();
      return of({
        success: true,
        message: 'No token to logout',
        statusCode: 200,
        data: ''
      });
    }

    return this.http.post<ApiResponse<string>>(`${this.authUrl}/logout`, { refreshToken })
      .pipe(
        finalize(() => {
          this.jwtService.clearToken();
          this._loggedIn$$.next(false);
          this.userService.clearUser();  // ← 這裡！
          this.cartService.clearCart();
        })
      );
  }
}
