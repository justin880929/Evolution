import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, UserIdentity } from 'src/app/services/auth.service';
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
      next: (userIdentity: UserIdentity | null) => {
        if (userIdentity) {
          this.loginError = null;
          this.loginSuccess = true;
          // ✅ 1.5 秒後導向儀表板
          setTimeout(() => this.router.navigate(['/home']), 1500);
        } else {
          this.loginError = '登入失敗，無法取得身分資料';
        }
      },
      error: (err) => {
        this.loginError = err.message
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

