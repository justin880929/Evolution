import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { JWTService } from 'src/app/Share/JWT/jwt.service';

@Component({
  selector: 'app-init-password',
  templateUrl: './init-password.component.html',
  styleUrls: ['./init-password.component.css'],
  encapsulation: ViewEncapsulation.None // ✅ 把樣式設為全域
})


export class InitPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  loading = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private jwtService : JWTService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  passwordsMatch(group: FormGroup) {
    const pw = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pw === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    this.loading = true;
    this.errorMsg = null;
    this.successMsg = null;

    const dto = {
      token: this.token,
      newPassword: this.resetForm.value.newPassword
    };

    this.authService.initPassword(dto).subscribe({
      next: (res) => {
        if(!res.success)
        {
          console.error("API 回傳失敗 :",res.message);
          return ;
        }
        this.successMsg = res.message || '密碼已成功重設';
        this.loading = false;

        // 2 秒後自動導回登入頁
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);

      },
      error: (err) => {
        this.errorMsg = err.error?.message || '發生錯誤，請稍後再試';
        this.loading = false;
      }
    });
  }
}
