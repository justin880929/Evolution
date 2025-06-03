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
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // 建立表單驗證規則
    this.loginForm = this.fb.group({
      email: ['tommyispan@gmail.com', [Validators.required, Validators.email]],
      password: ['tommy880929', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // 2) 如果 localStorage 有存 email，就預填並幫使用者勾選 rememberMe
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true
      });
    }

    // 當使用者修改表單時，自動清除錯誤訊息
    this.loginForm.valueChanges.subscribe(() => {
      this.loginError = null;
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    // 3) 解構出 rememberMe
    const { email, password, rememberMe } = this.loginForm.value;

    // 4) 依 rememberMe 存／移除 savedEmail
    if (rememberMe) {
      localStorage.setItem('savedEmail', email);
    } else {
      localStorage.removeItem('savedEmail');
    }

    // 5) 呼叫登入 API
    this.authService.login(email, password).subscribe({
      next: (userIdentity: UserIdentity | null) => {
        if (userIdentity) {
          this.loginError = null;
          this.loginSuccess = true;
          this.username = userIdentity.username;
          // 1.5 秒後導向
          setTimeout(() => this.router.navigate(['/home']), 1500);
        } else {
          this.loginError = '登入失敗，無法取得身分資料';
        }
      },
      error: (err) => {
        this.loginError = err.message;
        setTimeout(() => {
          this.loginError = null;
        }, 3000);
        const card = document.querySelector('.login-box');
        card?.classList.add('shake');
        setTimeout(() => card?.classList.remove('shake'), 500);
      }
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}

