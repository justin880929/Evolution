import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service/course.service';
import { CartService } from 'src/app/services/cart.service';
import { CourseDto } from 'src/app/Interface/courseDTO';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: CourseDto | null = null;
  loadError = false;

  isLoggedIn = false;

  private storageKey = 'own-courses';
  ownCourses: number[] = [];

  constructor(
    private messageService: MessageService,  // 注入
    private route: ActivatedRoute,
    private courseService: CourseService,
    private cartService: CartService, // ⬅️ 注入購物車服務
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$
      .subscribe(flag => this.isLoggedIn = flag);

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.courseService.getCourseById(+id).subscribe({
        next: data => this.course = data,
        error: err => {
          console.error('課程載入失敗', err);
          this.loadError = true;
        }
      });
    } else {
      this.loadError = true;
    }

    const saved = localStorage.getItem(this.storageKey);
    this.ownCourses = saved ? JSON.parse(saved) as number[] : [];

  }

  /** ✅ 加入購物車 */
 addToCart(): void {
    // 0. 未登入
    if (!this.isLoggedIn) {
      this.messageService.add({
        severity: 'warn',
        summary: '請先登入',
        detail: '請先登入才能加入購物車'
      });
      this.router.navigate(['/login']);
      return;
    }

    // 1. 已擁有
    if (this.course && this.ownCourses.includes(this.course.courseId)) {
      this.messageService.add({
        severity: 'warn',
        summary: '已擁有課程',
        detail: `您已擁有 "${this.course.courseTitle}"，無法重複加入`
      });
      return;
    }

    // 2. 資料檢查
    if (!this.course) {
      this.messageService.add({
        severity: 'error',
        summary: '錯誤',
        detail: '課程資料有誤，無法加入購物車'
      });
      return;
    }

    // 3. 加入購物車
    const added = this.cartService.addToCart(this.course.courseId);
    if (!added) {
      this.messageService.add({
        severity: 'info',
        summary: '已在購物車',
        detail: '該課程已經在購物車中了'
      });
      return;
    }

    // 4. 成功
    this.messageService.add({
      severity: 'success',
      summary: '加入成功',
      detail: `"${this.course.courseTitle}" 已加入購物車`
    });
    this.router.navigate(['/home/course-products']);
  }
}
