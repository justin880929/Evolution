import { CanActivateFn, CanActivateChildFn, Router, UrlTree } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { inject } from '@angular/core';
import { JWTService } from "../JWT/jwt.service";
import { Observable, of, switchMap } from 'rxjs';

export const guardsGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const jwtService = inject(JWTService);
  const router = inject(Router);
  if (!localStorage.getItem('jwt')) {
    // 如果沒有 jwt，直接跳轉 login
    return of(router.createUrlTree(['login']));
  }
  const jwt = jwtService.UnpackJWT();
  if (
    jwt &&
    (jwt.role.toLowerCase() === 'admin' || jwt.role.toLowerCase() === 'superadmin')
  ) {
    // 通過
    return of(true);
  } else {
    // 否則導頁到 /login
    console.log("老哥你沒有權限");

    return of(router.createUrlTree(['home']));
  }
};
export const loginGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const jwtService = inject(JWTService);
  const router = inject(Router);
  if (localStorage.getItem('jwt')) {
    // 如果沒有 jwt，直接跳轉 login
    return of(router.createUrlTree(['home']));
  } else {
    console.log("老哥你有登入過了");
    return of(true)
  }
};
export const guardsChildGuard: CanActivateChildFn = (childRoute, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const excludedPaths = ['', 'description', 'course-products'];

  if (excludedPaths.includes(childRoute.routeConfig?.path || '')) {
    // 這兩個路由不用驗證，直接放行
    return of(true);
  }
  if (!localStorage.getItem('jwt')) {
    // 如果沒有 jwt，直接跳轉 login
    return of(router.createUrlTree(['login']));
  }
  // 有 jwt，呼叫 refreshToken 並等待結果
  return of(true)
};
