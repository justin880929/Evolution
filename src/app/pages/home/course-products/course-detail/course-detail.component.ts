import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/services/course.service/course.service';
import { CartService } from 'src/app/services/cart.service';
import { courseDTO } from 'src/app/Interface/courseDTO';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: courseDTO | null = null;
  loadError = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private cartService: CartService // ⬅️ 注入購物車服務
  ) { }

  ngOnInit(): void {
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
    if (this.course) {
      this.cartService.addToCart(this.course);
      this.cartService.addToCart(this.course);
      alert('✅ 已加入購物車');
    }
  }
}
