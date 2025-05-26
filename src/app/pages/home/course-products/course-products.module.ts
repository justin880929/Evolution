import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CourseProductsComponent } from './course-products.component';
import { CourseCardComponent } from './course-card/course-card.component';

@NgModule({
  declarations: [CourseProductsComponent, CourseCardComponent],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class CourseProductsModule {}
