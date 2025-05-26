import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackSystemRoutingModule } from './back-system-routing.module';
import { BackSystemComponent } from './back-system.component';
import { CourselistComponent } from './courselist/courselist.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { CourseGoalsComponent } from './course-goals/course-goals.component';
import { CourseManageComponent } from './course-manage/course-manage.component';
import { EmpPermissionsComponent } from './emp-permissions/emp-permissions.component';
import { HashTagManageComponent } from './hash-tag-manage/hash-tag-manage.component';
import { QuizzesManageComponent } from './quizzes-manage/quizzes-manage.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackDashboardComponent } from './back-dashboard/back-dashboard.component';
import { DepManageComponent } from './dep-manage/dep-manage.component';
import { CreateDepComponent } from './create-dep/create-dep.component';
import { EmpManageComponent } from './emp-manage/emp-manage.component';
import { CreateEmpComponent } from './create-emp/create-emp.component';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { StatusToTagPipe } from '../Pipe/emp.pipe';

import { StepsModule } from 'primeng/steps';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AnimateModule } from 'primeng/animate';
import { InputNumberModule } from 'primeng/inputnumber';
@NgModule({
  declarations: [
    BackSystemComponent,
    CourseGoalsComponent,
    CourseManageComponent,
    CourselistComponent,
    QuizzesManageComponent,
    EmpPermissionsComponent,
    HashTagManageComponent,
    CreateCourseComponent,
    BackDashboardComponent,
    DepManageComponent,
    CreateDepComponent,
    EmpManageComponent,
    CreateEmpComponent,
  ],
  imports: [
    CommonModule,
    BackSystemRoutingModule,
    RouterModule,
    FormsModule,
    StepsModule,
    ConfirmDialogModule,
    DialogModule,
    FileUploadModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    AnimateModule,
    InputNumberModule,
    TableModule,
    TagModule,
    StatusToTagPipe,
  ],
  providers: [
    ConfirmationService,
    MessageService, // 如果你用到了 toast 或 growl 等通知功能，也要註冊這個
  ],
})
export class BackSystemModule {}
