// src/app/services/config.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  // 為了讓其他 Service 監聽到變化，可以改用 RxJS BehaviorSubject
  private _useMock = new BehaviorSubject<boolean>(false);
  public useMock$ = this._useMock.asObservable();
  apiUrl = 'https://localhost:7274';

  constructor() {}

  // 取得當前值
  get useMock(): boolean {
    return this._useMock.value;
  }

  // 動態改變值
  setUseMock(flag: boolean) {
    this._useMock.next(flag);
  }
}
