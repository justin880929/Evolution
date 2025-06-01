import { ResultService } from './../Share/result.service';
import { jwtDecode } from 'jwt-decode';
import { JWTService } from './../Share/JWT/jwt.service';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { UserDTO } from '../Interface/userDTO';
import { ApiResponse } from '../Share/interface/resultDTO';


@Injectable({
  providedIn: 'root',
})

export class UserService {
  private apiUrl = 'https://localhost:7274/api';

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

    return this.resultService
      .postResult<ApiResponse<UserDTO>>(`${this.apiUrl}/userinfo`, {})
      .pipe(
        map((apiRes) => {
          if (!apiRes.success || !apiRes.data) {
            throw new Error(apiRes.message || '無法取得使用者資訊');
          }
          return apiRes.data;
        }),
        catchError((err) => {
          console.error('getUserInfo 發生錯誤：', err);
          return throwError(() => err);
        })
      );
  }

  /** 更新使用者文字欄位 */
  updateUser(user: UserDTO): Observable<UserDTO> {
    if (this.configService.useMock) {
      return of(user);
    }

    return this.resultService
      .postResult<ApiResponse<UserDTO>>(`${this.apiUrl}/userinfo`, user)
      .pipe(
        map((apiRes) => {
          if (!apiRes.success || !apiRes.data) {
            throw new Error(apiRes.message || '無法更新使用者資訊');
          }
          return apiRes.data;
        }),
        catchError((err) => {
          console.error('updateUser 發生錯誤：', err);
          return throwError(() => err);
        })
      );
  }

  /**
   * 更新使用者資料（含大頭照上傳）。
   * 這裡假設後端路由是 POST /api/userinfo/avatar，並且 expect multipart/form-data。
   * 如果你的後端將檔案更新放在同一個 endpoint，只要把 URL 換成 `/userinfo` 也行。
   */
  updateUserWithAvatar(formData: FormData): Observable<UserDTO> {
    if (this.configService.useMock) {
      // 在 mock 狀況下，我們可以只模擬「把文字＋pic 放回去」
      // 假設 formData 裡有 name、email、company、dep 與 avatar
      const mockUser: UserDTO = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        company: formData.get('company') as string,
        dep: formData.get('dep') as string,
        // 由於是 mock，所以隨便用一個 Data URL 或固定字串都行，
        // 這裡假設使用者剛才用 FileReader 生成的 Base64 串存在 formData.get('avatarPreview')（可自行決定）
        pic: (formData.get('avatarPreview') as string) || 'assets/img/NoprofilePhoto.png',
      };
      return of(mockUser);
    }

    // 真實情況下把 FormData 送到後端
    return this.http
      .post<ApiResponse<UserDTO>>(`${this.apiUrl}/userinfo/avatar`, formData)
      .pipe(
        map((apiRes) => {
          if (!apiRes.success || !apiRes.data) {
            throw new Error(apiRes.message || '無法更新大頭照');
          }
          return apiRes.data;
        }),
        catchError((err) => {
          console.error('updateUserWithAvatar 發生錯誤：', err);
          return throwError(() => err);
        })
      );
  }

  /** 取得使用者資訊 */
  // getUserInfo(): Observable<UserInfoDTO> {
  //   if (this.configService.useMock) {
  //     const mockUser: UserInfoDTO = {
  //       userId:   123,
  //       username: 'tommy',
  //       email:    'tommy@test.com'
  //     };
  //     return of(mockUser);
  //   }

  //   return this.http
  //   .get<ApiResponse<UserInfoDTO>>(`${this.apiUrl}/users/useridfo`)
  //   .pipe(
  //     map(res =>{
  //       if (!res.success || !res.data){
  //         throw new Error(res.message || '無法取得使用者資訊');
  //       }

  //       return res.data;
  //     }),
  //     catchError(err => throwError(()=> err))
  //   );
  // }
}
