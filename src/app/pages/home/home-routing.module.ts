import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CourseProductsComponent } from './course-products/course-products.component';
import { DescriptionComponent } from './description/description.component';
import { LearningComponent } from './learning/learning.component';
import { CourseDetailComponent } from './course-products/course-detail/course-detail.component'; // ⬅️ 記得匯入
import { CartComponent } from './cart/cart.component'; // ⬅️ 記得匯入購物車元件

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'description', pathMatch: 'full' },
      { path: 'description', component: DescriptionComponent },
      { path: 'course-products', component: CourseProductsComponent },
      { path: 'learning', component: LearningComponent },
      { path: 'course-products/detail/:id', component: CourseDetailComponent }, // ⬅️ 新增這行
      { path: 'cart', component: CartComponent },
      { path: '**', redirectTo: 'description' }, // 可放在 children 裡，處理子路由找不到的情況
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
