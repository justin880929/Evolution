import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service/course.service';
import { CartService } from 'src/app/services/cart.service';
import { CourseDto } from 'src/app/Interface/courseDTO';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: CourseDto | null = null;
  loadError = false;

  isLoggedIn = false;

  constructor(
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
  }

  /** ✅ 加入購物車 */
 addToCart(): void {
  // 1. 未登入就導到登入頁
  if (!this.isLoggedIn) {
    alert('請先登入才能加入購物車');
    this.router.navigate(['/login']);
    return;
  }

  // 2. 確保有課程物件
  if (!this.course) {
    alert('課程資料有誤，無法加入購物車');
    return;
  }

  // 3. 呼叫 addToCart()，回傳 true=成功加入、false=已存在
  const added = this.cartService.addToCart(this.course.courseId);
  if (!added) {
    // 已在購物車裡
    alert('⚠️ 已經在購物車裡面');
    return;
  }

  // 4. 成功加入
  alert('✅ 已加入購物車');
  this.router.navigate(['/home/course-products']);
}
}
