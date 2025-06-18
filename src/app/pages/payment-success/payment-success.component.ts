import { PaymentService } from './../../services/payment.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  orderId!: string;
  private storageKey = 'own-courses';
  ownCourses: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    // 1. 先把 orderId 從 URL 拿出來
    this.orderId = this.route.snapshot.queryParamMap.get('orderId') || '';

    // 2. 付款成功後，呼叫 clearCart() 清空購物車
    this.cartService.clearCart();

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
  })
}

  goHome() {
    this.router.navigate(['/']);
  }
}
