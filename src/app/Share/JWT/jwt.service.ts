import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class JWTService {

  constructor() { }
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }
  setToken(token: string) {
    localStorage.setItem('jwt', token);
  }
  UnpackJWT(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded: any = jwtDecode(token);

    // 🔍 找到 key 包含 "identity/claims/role"
    for (const key in decoded) {
      if (key.includes('identity/claims/role')) {
        return decoded[key]; // ⬅️ 回傳角色，例如 "Admin"
      }
    }

    // 如果 role  沒取到可以依需要回傳 null 或部分值
    return null;
  }
}
