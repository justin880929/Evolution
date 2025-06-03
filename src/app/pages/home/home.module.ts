import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DescriptionComponent } from './description/description.component';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CourseProductsComponent } from './course-products/course-products.component';
import { CourseCardComponent } from './course-products/course-card/course-card.component';
import { CourseDetailComponent } from './course-products/course-detail/course-detail.component';
import { UserRepositoriesComponent } from './user-repositories/user-repositories.component';
import { LearningComponent } from './learning/learning.component';
import { TabViewModule } from 'primeng/tabview';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CartComponent } from './cart/cart.component';
import { BadgeModule }  from 'primeng/badge';
import { UserComponent } from './user/user.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { LearingListComponent } from './user/learing-list/learing-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    HomeComponent,
    DescriptionComponent,
    CourseProductsComponent,
    CourseCardComponent,
    CourseDetailComponent,
    UserRepositoriesComponent,
    LearningComponent,
    CartComponent,
    UserComponent,
    LearingListComponent,
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
    TabViewModule,
    StepsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    BadgeModule,
    ContextMenuModule,
    ReactiveFormsModule,
    ToolbarModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule,
    RippleModule,
  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class HomeModule { }
