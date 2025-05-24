import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent {
  forgotForm: FormGroup;
  message: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    const email = this.forgotForm.value.email;

    this.authService.sendResetLink(email).subscribe({
      next: (res) => {
        this.message = res.message; // 統一處理成功訊息
        this.error = null;

        // ✅ 2.5 秒後自動導向登入頁
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },
      error: (err: HttpErrorResponse) => {
        this.message = '伺服器錯誤，請稍後再試'; // ✅ 僅處理真的 API 錯誤

            // 幾秒後自動清除訊息（例如顯示 3 秒）
      setTimeout(() => {
        this.message = null;
      }, 3000);

      }
    });
  }
}
