import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {

  username = '訪客';
  userPhotoUrl = '../../../assets/img/EvolutionLogo.png';

  constructor(private router: Router) { }

  ngOnInit(): void {
    const token = localStorage.getItem('jwt'); // 🔄 改成讀 localStorage 中的 jwt

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.username =
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '使用者';
      } catch (error) {
        console.error('JWT 解碼失敗:', error);
        this.username = '訪客';
      }
    }
  }

  logout(): void {
    console.log('使用者登出中...');
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
