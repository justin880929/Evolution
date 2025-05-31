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
  setToken(token: string, refreshToken: string) {
    localStorage.setItem('jwt', token);
    localStorage.setItem('refresh_token', refreshToken);
  }
  clearToken() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('refresh_token'); // 如果有存
  }
  UnpackJWT(): { role: string, username: string, exp: number,id:number } | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    const User: { username: string, role: string, exp: number,id:number } = {
    id: 0,
    username: '',
    role: '',
    exp: 0
    };

    for (const key in decoded) {
      if (key.includes('name')) {
        User.username = decoded[key];
      }
      if (key.includes('role')) {
        User.role = decoded[key];
      }
      if (key.includes('sub')) {
        User.id = decoded[key];
      }
    }

    if (typeof decoded.exp === 'number') {
      User.exp = decoded.exp;
    }
    return User.username && User.role && User.exp && User.id ? User : null;

  }
  shouldRefreshTokenSoon(bufferSeconds = 60): boolean {
    const info = this.UnpackJWT();
    if (!info) return false;

    const now = Math.floor(Date.now() / 1000);
    return (info.exp - now) < bufferSeconds;
  }
}
