import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DescriptionComponent } from './description/description.component';

// 加入原本 CourseProductsModule 中的元件
import { CourseProductsComponent } from './course-products/course-products.component';
import { CourseCardComponent } from './course-products/course-card/course-card.component';
import { CourseDetailComponent } from './course-products/course-detail/course-detail.component';

@NgModule({
  declarations: [
    HomeComponent,
    DescriptionComponent,
    CourseProductsComponent,
    CourseCardComponent,
    CourseDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
