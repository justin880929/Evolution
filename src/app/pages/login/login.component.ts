import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, UserIdentity } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';    // ← 匯入
import { Router } from '@angular/router';

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
    private userService: UserService,   // ← 注入
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({ email: savedEmail, rememberMe: true });
    }
    this.loginForm.valueChanges.subscribe(() => this.loginError = null);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password, rememberMe } = this.loginForm.value;
    if (rememberMe) {
      localStorage.setItem('savedEmail', email);
    } else {
      localStorage.removeItem('savedEmail');
    }

    this.authService.login(email, password).subscribe({
      next: (userIdentity: UserIdentity | null) => {
        if (userIdentity) {
          // 把 JWT payload 放到 username
          this.username = userIdentity.username;
          this.loginSuccess = true;

          // 👉 在此呼叫 refreshUserInfo()，才能拿到最新的 pic
          this.userService.refreshUserInfo().subscribe({
            next: () => {
              // 完成 refresh 後再導頁
              setTimeout(() => this.router.navigate(['/home']), 1500);
            },
            error: err => {
              console.error('取得使用者完整資訊失敗', err);
              // 即便失敗，也導頁
              setTimeout(() => this.router.navigate(['/home']), 1500);
            }
          });
        } else {
          this.loginError = '登入失敗，無法取得身分資料';
        }
      },
      error: err => {
        this.loginError = err.message;
        const card = document.querySelector('.login-box');
        card?.classList.add('shake');
        setTimeout(() => card?.classList.remove('shake'), 500);
        setTimeout(() => this.loginError = null, 3000);
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
