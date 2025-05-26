import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CourseProductsComponent } from './course-products/course-products.component';
import { DescriptionComponent } from './description/description.component';
import { LearningComponent } from './learning/learning.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      //課程總覽
      { path: '', redirectTo: 'description', pathMatch: 'full' },
      { path: 'description', component: DescriptionComponent },
      { path: 'course-products', component: CourseProductsComponent },
      { path: 'learning', component: LearningComponent },
      { path: '**', redirectTo: 'description' }, // 可放在 children 裡，處理子路由找不到的情況
      {
        path: 'course-products',
        loadChildren: () =>
          import('./course-products/course-products.module').then(
            (m) => m.CourseProductsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
