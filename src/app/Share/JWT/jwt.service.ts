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
  UnpackJWT(): { role: string, username: string } | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    // 初始化 User 結構
    const user: { id: number, username: string, role: string } = {
    id: 0,
    username: '',
    role: ''
  };
    // 🔍 找到 key 包含 "identity/claims/role"
     for (const key in decoded) {
    if (key.includes('nameidentifier')) user.id = parseInt(decoded[key]);
    if (key.includes('name')) user.username = decoded[key];
    if (key.includes('role')) user.role = decoded[key];
  }

    // 如果 role 或 exp 沒取到可以依需要回傳 null 或部分值
    return user.id && user.username && user.role ? user : null;
  }

  clearToken(): void {
    localStorage.removeItem('jwt');
  }
}
