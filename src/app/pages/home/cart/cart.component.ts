import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { courseDTO } from 'src/app/Interface/courseDTO';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  // 由 Service 推送過來的購物車陣列
  cartItems: courseDTO[] = [];
  // PrimeNG Table 勾選後的資料陣列
  selectedItems: courseDTO[] = [];

  // 訂閱用的 Subscription
  private cartSub!: Subscription;

  constructor(
    private cartService: CartService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // 1. （可選）一進到頁面就先拿一次 localStorage 裡的資料
    this.cartItems = this.cartService.getCart();

    // 2. 訂閱 cartItems$，Service 一旦有 saveCart()、clearCart() 等呼叫，就會推送最新陣列
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnDestroy(): void {
    // 離開元件時取消訂閱，避免 memory leak
    this.cartSub.unsubscribe();
  }

  // 算總價
  getSelectedTotal(): number {
  // 如果 selectedItems 是 undefined 或空陣列，就回傳 0
  if (!this.selectedItems || this.selectedItems.length === 0) {
    return 0;
  }
  // 否則把每個 item.price 都加起來
  return this.selectedItems
    .map(item => item.price)
    .reduce((sum, price) => sum + price, 0);
}

  // 單筆刪除，按下垃圾桶圖示時觸發
  deleteItem(item: courseDTO): void {
    this.confirmationService.confirm({
      message: `確定要刪除「${item.title}」嗎？`,
      header: '刪除確認',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // 呼叫 Service 刪除，Service 會自動推送新陣列
        this.cartService.removeFromCart(item.id);
        // 同步把已勾選裡的那筆移除
        this.selectedItems = this.selectedItems.filter(si => si.id !== item.id);
        // 顯示成功訊息
        this.messageService.add({
          severity: 'success',
          summary: '刪除成功',
          detail: `已移除「${item.title}」`,
          life: 3000
        });
      }
      // 取消不做任何事
    });
  }

  // 批次刪除：按下 Toolbar 的「Delete」按鈕時觸發
  deleteSelectedItems(): void {
    if (!this.selectedItems || this.selectedItems.length === 0) {
      return;
    }

    this.confirmationService.confirm({
      message: `確定要刪除已選擇的 ${this.selectedItems.length} 項商品嗎？`,
      header: '刪除確認',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // 依序呼叫 Service.removeFromCart(), Service 會推送新陣列
        this.selectedItems.forEach(item => {
          this.cartService.removeFromCart(item.id);
        });
        // 清空勾選陣列
        this.selectedItems = [];
        // 顯示成功訊息
        this.messageService.add({
          severity: 'success',
          summary: '刪除成功',
          detail: '已移除所有已選擇項目',
          life: 3000
        });
      }
    });
  }

  // 清空整個購物車
  clearCart(): void {
    this.confirmationService.confirm({
      message: '確定要清空購物車嗎？',
      header: '清空確認',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // 呼叫 Service.clearCart(), Service 會推送空陣列
        this.cartService.clearCart();
        // 同步清空勾選陣列
        this.selectedItems = [];
        // 顯示訊息
        this.messageService.add({
          severity: 'info',
          summary: '已清空',
          detail: '購物車已清空',
          life: 3000
        });
      }
    });
  }

  checkout(){}
}
