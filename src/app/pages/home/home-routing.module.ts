import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CourseProductsComponent } from './course-products/course-products.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      //課程總覽
      { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: 'course-products', component: CourseProductsComponent },
    ],
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
