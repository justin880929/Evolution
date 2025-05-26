import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DescriptionComponent } from './description/description.component';
import { CourseProductsComponent } from './course-products/course-products.component';
import { CourseProductsModule } from './course-products/course-products.module';

@NgModule({
  declarations: [
    HomeComponent,
    DescriptionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HomeRoutingModule,
    CourseProductsModule
  ]
})
export class HomeModule { }
