import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { ResultService } from '../Share/result.service';
import { UserDTO } from '../Interface/userDTO';
import { ApiResponse } from '../Share/interface/resultDTO';
import { UserInfoDTO } from '../Interface/userInfoDTO';                 // ← 確認這行
import { EditUserResponseDTO } from '../Interface/editUserResponseDTO'; // ← 確認這行
import { DepListResponseDTO } from '../Interface/depListResponseDTO';
import { EmpOrderDTO } from '../Interface/empOrderDTO';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7274/api';

  private userSubject = new BehaviorSubject<UserDTO | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private resultService: ResultService
  ) {}

  /** 取得使用者資訊 */
  getUserInfo(): Observable<UserDTO> {
    if (this.configService.useMock) {
      const mockUser: UserDTO = {
        name: 'tommy',
        email: 'tommy@test.com',
        dep: '測試部',
        pic: 'null',
        company: '測試公司',
      };
      return of(mockUser);
    }

    // 真實環境：打 GET /api/users/useridfo （注意要加 /users 前綴）
    return this.http
      .get<ApiResponse<UserInfoDTO>>(`${this.apiUrl}/users/userinfo`)
      .pipe(
        map((apiRes) => {
          if (!apiRes.success || !apiRes.data) {
            throw new Error(apiRes.message || '無法取得使用者資訊');
          }

          // 後端回傳的是 UserInfoDTO，要轉成前端的 UserDTO
          const dto: UserInfoDTO = apiRes.data;
          const result: UserDTO = {
            name:    dto.username,
            email:   dto.email,
            dep:     dto.depName,           // 如果後端有回 depName，就直接帶回來
            pic:     dto.photoUrl || '',
            company: dto.userCompany || ''
          };
          return result;
        }),
        catchError((err) => {
          console.error('getUserInfo 發生錯誤：', err);
          return throwError(() => err);
        })
      );
  }

  /** 既有：一開始 App 啟動時用的載入方法 */
  loadUserInfo(): void {
    this.getUserInfo()
      .subscribe({
        next: user => this.userSubject.next(user),
        error: err => console.error('載入使用者資訊失敗：', err)
      });
  }

 /** 編輯使用者資訊（含大頭照上傳） */
  editUserInfo(formData: FormData): Observable<ApiResponse<EditUserResponseDTO>> {
    return this.http
      .put<ApiResponse<EditUserResponseDTO>>(
        `${this.apiUrl}/users/edituseridfo`,
        formData
      )
      .pipe(
        tap((apiRes) => {
          if (apiRes.success && apiRes.data) {
            // ← 這裡要先把 userInfo 解構出來
            const ui = apiRes.data.userInfo;

            const updated: UserDTO = {
              name: ui.username,
              email: ui.email,
              dep: ui.depName,
              pic: ui.photoUrl || '',
              // 如果後端還有回 companyName 或 userCompany，可以在 ui 內多加一個屬性，再這裡填上
              company: ''
            };
            this.userSubject.next(updated);
          }
        }),
        catchError((err) => throwError(() => err))
      );
  }

  /** 手動強制刷新使用者資料，再推到 BehaviorSubject */
  refreshUserInfo(): void {
    this.getUserInfo().subscribe({
      next: (user) => this.userSubject.next(user),
      error: (err) => console.error('手動刷新使用者資訊失敗：', err),
    });
  }

  /** 如果還需要：更新大頭照範例 */
  updateUserWithAvatar(formData: FormData): Observable<UserDTO> {
    if (this.configService.useMock) {
      const mockUser: UserDTO = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        company: formData.get('company') as string,
        dep: formData.get('dep') as string,
        pic: (formData.get('avatarPreview') as string) || 'assets/img/NoprofilePhoto.png',
      };
      return of(mockUser);
    }

    return this.http
      .post<ApiResponse<UserDTO>>(`${this.apiUrl}/userinfo/avatar`, formData)
      .pipe(
        map((apiRes) => {
          if (!apiRes.success || !apiRes.data) {
            throw new Error(apiRes.message || '無法更新大頭照');
          }
          return apiRes.data;
        }),
        catchError((err) => throwError(() => err))
      );
  }

    getDepList(): Observable<string[]> {
    return this.http
      .get<ApiResponse<DepListResponseDTO[]>>(`${this.apiUrl}/Users/dept-list`)
      .pipe(
        // 先檢查 success，如果不是就拋錯
        map(resp => {
          if (!resp.success || !resp.data) {
            throw new Error(resp.message || '取得部門列表失敗');
          }
          // 將 DTO 陣列轉成只要 depName 的 string[]
          return resp.data.map(item => item.depName || '');
        })
      );
  }

  getMyOrders(): Observable<EmpOrderDTO[]> {
    return this.http
    .get<ApiResponse<EmpOrderDTO[]>>(`${this.apiUrl}/Users/user-order`)
    .pipe(
      map(res =>{
        if(!res.success)
          throw new Error(res.message || '取得已購買課程失敗');
        return res.data ?? [];
      })
    )
  }
}
