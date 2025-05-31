import { ResultService } from './../Share/result.service';
import { jwtDecode } from 'jwt-decode';
import { JWTService } from './../Share/JWT/jwt.service';
import { ConfigService } from './Config.service';
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

  constructor(private http: HttpClient, private configService: ConfigService, private jwtService: JWTService,private resultService : ResultService) { }

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

  // 呼叫不帶參數的後端 API
  return this.resultService
    .postResult<ApiResponse<UserDTO>>(`${this.apiUrl}/userinfo`, {})
    .pipe(
      map((apiRes: ApiResponse<UserDTO>) => {
        if (!apiRes.success || !apiRes.data) {
          throw new Error(apiRes.message || '無法取得使用者資訊');
        }
        return apiRes.data;
      }),
      catchError(err => {
        console.error('getUserInfo 發生錯誤：', err);
        return throwError(() => err);
      })
    );
}

}
