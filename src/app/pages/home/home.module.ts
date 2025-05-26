import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DescriptionComponent } from './description/description.component';
import { LearningComponent } from './learning/learning.component';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
// 加入原本 CourseProductsModule 中的元件
import { CourseProductsComponent } from './course-products/course-products.component';
import { CourseCardComponent } from './course-products/course-card/course-card.component';
import { CourseDetailComponent } from './course-products/course-detail/course-detail.component';
import { CartComponent } from './cart/cart.component';

@NgModule({
  declarations: [
    HomeComponent,
    DescriptionComponent,
    CourseProductsComponent,
    CourseCardComponent,
    CourseDetailComponent,
    LearningComponent,
    CartComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HomeRoutingModule,
    AvatarModule,
    AvatarGroupModule,
    CardModule,
    AutoCompleteModule,
  ],
})
export class HomeModule {}
