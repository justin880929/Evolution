import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { courseDTO } from '../Interface/courseDTO';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'shopping_cart';

  // 1. 這個用來推送「購物車數量」的 BehaviorSubject（維持你原有邏輯）
  private cartCountSubject = new BehaviorSubject<number>(this.loadCart().length);
  cartCount$ = this.cartCountSubject.asObservable();

  // 2. 新增：用來推送「整個購物車內容陣列」的 BehaviorSubject
  private cartItemsSubject = new BehaviorSubject<courseDTO[]>(this.loadCart());
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() { }

  /** ✅ 從 localStorage 讀取整個購物車陣列 */
  private loadCart(): courseDTO[] {
    const cartJson = localStorage.getItem(this.storageKey);
    return cartJson ? JSON.parse(cartJson) as courseDTO[] : [];
  }

  /**
   * ✅ 將 cart 陣列存回 localStorage，並同時推送
   *    1. 推送最新的 cart.length 給 cartCountSubject
   *    2. 推送最新的整個 cart 陣列給 cartItemsSubject
   */
  private saveCart(cart: courseDTO[]): void {
    // (A) 存到 localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(cart));

    // (B) 推送最新「數量」給訂閱 cartCount$
    this.cartCountSubject.next(cart.length);

    // (C) 推送最新「整個陣列」給訂閱 cartItems$
    this.cartItemsSubject.next(cart);
  }

  /** ✅ 直接從 localStorage 回傳購物車內容 */
  getCart(): courseDTO[] {
    return this.loadCart();
  }

  /** ✅ 新增一筆商品到購物車 */
  addToCart(course: courseDTO): void {
    const cart = this.loadCart();
    const exists = cart.some(c => c.id === course.id);
    if (!exists) {
      cart.push(course);
      this.saveCart(cart);
    }
  }

  /** ✅ 移除指定商品 */
  removeFromCart(courseId: number): void {
    const cart = this.loadCart().filter(c => c.id !== courseId);
    this.saveCart(cart);
  }

  /** ✅ 清空購物車 */
  clearCart(): void {
    localStorage.removeItem(this.storageKey);

    // 推送空陣列給 cartItems$，並推送數量 0 給 cartCount$
    this.cartItemsSubject.next([]);
    this.cartCountSubject.next(0);
  }

  /** ✅ 回傳目前購物車數量 */
  getCartCount(): number {
    return this.loadCart().length;
  }
}
