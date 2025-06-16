import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-fail',
  template: `
    <div class="p-d-flex p-jc-center p-ai-center" style="height:80vh">
      <div class="card p-4 text-center">
        <h2>❌ 付款失敗或已取消</h2>
        <p>訂單編號：{{ orderId }}</p>
        <button pButton label="回到購物車" (click)="goCart()"></button>
      </div>
    </div>
  `
})
export class PaymentFailComponent implements OnInit {
  orderId!: string;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId') || '';
  }
  goCart() {
    this.router.navigate(['/cart']);
  }
}
