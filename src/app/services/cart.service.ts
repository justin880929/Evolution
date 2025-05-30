import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { courseDTO } from '../Interface/courseDTO';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'shopping_cart';

  // BehaviorSubject to track cart count
  private cartCountSubject = new BehaviorSubject<number>(this.loadCart().length);
  /** Observable for components to subscribe to cart count updates */
  cartCount$ = this.cartCountSubject.asObservable();

  constructor() { }

  /** ✅ 讀取 localStorage，初始化或更新內部 cart 狀態 */
  private loadCart(): courseDTO[] {
    const cartJson = localStorage.getItem(this.storageKey);
    return cartJson ? JSON.parse(cartJson) : [];
  }

  /** ✅ 儲存購物車到 localStorage 並發出最新 count */
  private saveCart(cart: courseDTO[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    // emit new count
    this.cartCountSubject.next(cart.length);
  }

  /** ✅ 取得購物車內容 */
  getCart(): courseDTO[] {
    return this.loadCart();
  }

  /** ✅ 新增課程到購物車（避免重複） */
  addToCart(course: courseDTO): void {
    const cart = this.loadCart();
    const exists = cart.some(c => c.id === course.id);
    if (!exists) {
      cart.push(course);
      this.saveCart(cart);
    }
  }

  /** ✅ 移除指定課程 */
  removeFromCart(courseId: number): void {
    const cart = this.loadCart().filter(c => c.id !== courseId);
    this.saveCart(cart);
  }

  /** ✅ 清空購物車並重置 count */
  clearCart(): void {
    localStorage.removeItem(this.storageKey);
    this.cartCountSubject.next(0);
  }

  /** ✅ 回傳目前購物車數量 */
  getCartCount(): number {
    return this.loadCart().length;
  }
}
