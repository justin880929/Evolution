import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { guardsChildGuard, guardsGuard, loginGuard } from './Share/Guards/guards.guard';

const routes: Routes = [
  {
    path: 'back-system',
    // canActivate: [guardsGuard],
    loadChildren: () =>
      import('./back-system/back-system.module').then(
        (m) => m.BackSystemModule
      ),
  },
  {
    path: 'home',
    // canActivateChild: [guardsChildGuard],
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'login',
    canActivate: [loginGuard],
    component: LoginComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'forgot',
    component: ForgotComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // 前進/後退導航時，自動捲到先前儲存的位置／頂端
      scrollPositionRestoration: 'enabled',
      // 如果有 #fragment，也會自動捲到對應 element
      anchorScrolling: 'enabled',
      // 如有需要，可調整偏移量
      scrollOffset: [0, 0]
    })
  ],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppRoutingModule { }
