import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CourseProductsComponent } from './course-products/course-products.component';
import { DescriptionComponent } from "./description/description.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      //課程總覽
      { path: '', redirectTo: 'description', pathMatch: 'full' },
      { path: 'description', component: DescriptionComponent },
      { path: 'course-products', component: CourseProductsComponent },
      { path: '**', redirectTo: 'description' } // 可放在 children 裡，處理子路由找不到的情況
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
