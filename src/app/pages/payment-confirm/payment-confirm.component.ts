import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/services/cart.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-confirm',
  template: `
    <p *ngIf="loading">正在確認付款狀態…</p>
  `
})
export class PaymentConfirmComponent implements OnInit {
  loading = true;
  orderId!: string;
  transactionId!: string;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private cartService: CartService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    if (!params['orderId'] || !params['transactionId']) {
      this.navigateFail('參數不足');
      return;
    }

    // 用 ! 斷言來消除 undefined 的可能
    this.orderId       = params['orderId']!;
    this.transactionId = params['transactionId']!;

    this.paymentService
  .confirmPayment(this.orderId, this.transactionId)
  .subscribe({
    next: res => {
      this.loading = false;
      if (res.success) {
        this.cartService.clearCart();
        this.router.navigate(
          ['/payment/success'],
          { queryParams: { orderId: this.orderId } }
        );
      } else {
        // ◆ 這裡用 ?? 給預設字串，就不會再報錯
        this.navigateFail(res.message ?? '付款失敗');
      }
    },
    error: err => {
      this.navigateFail('伺服器錯誤');
     }
      });
  });
}

  private navigateFail(detail: string) {
    this.loading = false;
    this.messageService.add({ severity: 'error', summary: '付款失敗', detail });
    this.router.navigate(['/payment/fail'], {
      queryParams: { orderId: this.orderId }
    });
  }
}
