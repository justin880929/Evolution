import { Injectable } from '@angular/core';
import { courseDTO } from '../Interface/courseDTO';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'shopping_cart';

  constructor() { }

  /** ✅ 取得購物車 */
  getCart(): courseDTO[] {
    const cartJson = localStorage.getItem(this.storageKey);
    return cartJson ? JSON.parse(cartJson) : [];
  }

  /** ✅ 新增課程到購物車（避免重複） */
  addToCart(course: courseDTO): void {
    const cart = this.getCart();
    const exists = cart.some(c => c.id === course.id);
    if (!exists) {
      cart.push(course);
      this.saveCart(cart);
    }
  }

  /** ✅ 移除課程 */
  removeFromCart(courseId: number): void {
    const cart = this.getCart().filter(c => c.id !== courseId);
    this.saveCart(cart);
  }

  /** ✅ 清空購物車 */
  clearCart(): void {
    localStorage.removeItem(this.storageKey);
  }

  /** ✅ 儲存購物車 */
  private saveCart(cart: courseDTO[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }
}
