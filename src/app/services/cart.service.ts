// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourseDto } from '../Interface/courseDTO';
import { ApiResponse } from '../Share/interface/resultDTO';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class CartService {
  private baseUrl = 'https://localhost:7274/api/courses';
  private storageKey = 'shopping_cart';

  // --- 只保留 ID 陣列的 subject + observable ---
  private cartIdsSubject = new BehaviorSubject<number[]>(this.loadCartIds());
  cartIds$ = this.cartIdsSubject.asObservable();

  // --- 新增：讓外面可以直接訂閱「數量」---
  cartCount$ = this.cartIds$.pipe(
    map((ids: number[]) => ids.length)
  );

  constructor(private http: HttpClient) {}

  private loadCartIds(): number[] {
    const json = localStorage.getItem(this.storageKey);
    return json ? JSON.parse(json) : [];
  }

  private saveCartIds(ids: number[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(ids));
    this.cartIdsSubject.next(ids);
  }

  addToCart(courseId: number): boolean {
    const ids = this.loadCartIds();
    if (!ids.includes(courseId)) {
      this.saveCartIds([...ids, courseId]);
      return true;
    }
    return false;
  }

  removeFromCart(courseId: number): void {
    this.saveCartIds(this.loadCartIds().filter(id => id !== courseId));
  }

  removeMultiple(courseIds: number[]): void {
    const remaining = this.loadCartIds().filter(id => !courseIds.includes(id));
    this.saveCartIds(remaining);
  }

  clearCart(): void {
    localStorage.removeItem(this.storageKey);
    this.cartIdsSubject.next([]);
  }

  /** 同步取 ID 陣列 */
  getCartIds(): number[] {
    return this.loadCartIds();
  }

  getCoursesByIds(ids: number[]): Observable<CourseDto[]> {
  return this.http
    .post<ApiResponse<CourseDto[]>>(`${this.baseUrl}/batch`, ids)
    .pipe(
      map(res => {
        if (!res.success) throw new Error(res.message);
        // 如果 res.data 是 undefined，就回傳空陣列
        return res.data ?? [];
      })
    );
}
}
