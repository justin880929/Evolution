import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-fail',
  templateUrl: './payment-fail.component.html',
  styleUrls: ['./payment-fail.component.css']
})
export class PaymentFailComponent implements OnInit {
  orderId!: string;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId') || '';
  }
  goCart() {
    this.router.navigate(['/home/cart']);
  }
}
