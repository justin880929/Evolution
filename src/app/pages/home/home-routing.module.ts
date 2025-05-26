import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CourseProductsComponent } from './course-products/course-products.component';
import { DescriptionComponent } from "./description/description.component";
import { CourseDetailComponent } from './course-products/course-detail/course-detail.component'; // ⬅️ 記得匯入

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'description', pathMatch: 'full' },
      { path: 'description', component: DescriptionComponent },
      { path: 'course-products', component: CourseProductsComponent },
      { path: 'course-products/detail/:id', component: CourseDetailComponent }, // ⬅️ 新增這行

      { path: '**', redirectTo: 'description' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
