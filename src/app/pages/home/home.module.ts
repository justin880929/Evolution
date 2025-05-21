import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { CourseProductsComponent } from './course-products/course-products.component';
import { DescriptionComponent } from './description/description.component';

@NgModule({
  declarations: [HomeComponent, CourseProductsComponent, DescriptionComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
