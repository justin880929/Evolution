import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { courseDTO } from 'src/app/Interface/courseDTO';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: courseDTO[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCart();
  }

  removeItem(id: number): void {
    this.cartService.removeFromCart(id);
    this.loadCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }
}
