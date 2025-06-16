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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // 1. 先把 orderId 從 URL 拿出來
    this.orderId = this.route.snapshot.queryParamMap.get('orderId') || '';

    // 2. 付款成功後，呼叫 clearCart() 清空購物車
    this.cartService.clearCart();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
