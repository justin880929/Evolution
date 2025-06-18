import { PaymentService } from 'src/app/services/payment.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { filter, Subscription } from 'rxjs';
import { UserInfoDTO } from './Interface/userInfoDTO';
import { UserDTO } from './Interface/userDTO';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'Evolution';
  username = '';
  userRole = '';
  userPhotoUrl = 'assets/img/NoprofilePhoto.png';
  isAdmin = false;
  private storageKey = 'own-courses';
  ownCourses: number[] = []; // 用來存放使用者的課程 ID

  private subs = new Subscription();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private paymentService: PaymentService
  ) {}

    ngOnInit(): void {
    // 1) 使用者剛登入（flag=true）時，觸發 loadUserInfo()
    this.subs.add(
      this.authService.isLoggedIn$
        .pipe(filter(flag => flag))
        .subscribe(() => {
          this.userService.loadUserInfo();
        })
    );

    // 2) 訂閱 user$
    this.subs.add(
      this.userService.user$.subscribe((user: UserDTO | null) => {
        if (user) {
          this.username     = user.name;
          this.userRole     = user.dep;          // 或你要顯示的 role
          this.userPhotoUrl = user.pic || this.userPhotoUrl;
          // 假設 superadmin/admin 在特定 dep
          this.isAdmin      = ['SuperAdmin','Admin'].includes(user.dep);
        } else {
          // 登出或載入失敗就重置
          this.username     = '';
          this.userRole     = '';
          this.userPhotoUrl = 'assets/img/NoprofilePhoto.png';
          this.isAdmin      = false;
        }
      })
    );

    this.paymentService.getOwnCourses().subscribe({
  next: (courses: number[]) => {
    // courses 就已經是一個 number[]，直接指派＆存到 localStorage
    this.ownCourses = courses;
    localStorage.setItem(this.storageKey, JSON.stringify(courses));
  },
  error: err => {
    console.error(err);
    this.ownCourses = [];
    localStorage.setItem(this.storageKey, JSON.stringify([]));
  }
});
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


}
