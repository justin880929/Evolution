import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { CourseProductsComponent } from './course-products/course-products.component';

@NgModule({
  declarations: [HomeComponent, CourseProductsComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
