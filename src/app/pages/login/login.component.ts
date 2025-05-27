import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string | null = null;
  loginSuccess = false;
  username: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // 建立表單驗證規則
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // 當使用者修改表單時，自動清除錯誤訊息
    this.loginForm.valueChanges.subscribe(() => {
      this.loginError = null;
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        if (res.success) {
          this.loginError = null;

          // 儲存 JWT
          localStorage.setItem('jwt', res.data.accessToken);
          this.loginSuccess = true;

          // ✅ 解碼 JWT（用 .default 呼叫）
          const decoded: any = jwtDecode(res.data.accessToken);

          // ✅ 取出使用者名稱（對應 ClaimTypes.Name）
          this.username =
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '使用者';

          // ✅ 1.5 秒後導向儀表板
          setTimeout(() => this.router.navigate(['/home']), 1500);
        } else {
          this.loginError = res.message || '登入失敗';
        }
      },
      error: (err) => {
        switch (err.status) {
          case 404:
            this.loginError = err.error?.message || '找不到此電子郵件';
            break;
          case 401:
            this.loginError = err.error?.message || '密碼錯誤';
            break;
          default:
            this.loginError = '伺服器發生錯誤，請稍後再試';
        }

        // 3 秒後清除錯誤訊息
        setTimeout(() => {
          this.loginError = null;
        }, 3000);

        // 錯誤動畫（加上 shake）
        const card = document.querySelector('.login-box');
        card?.classList.add('shake');
        setTimeout(() => card?.classList.remove('shake'), 500);
      }
    });
  }
}

