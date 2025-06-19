import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackSystemRoutingModule } from './back-system-routing.module';
import { BackSystemComponent } from './back-system.component';
import { CourselistComponent } from './courselist/courselist.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { CourseManageComponent } from './course-manage/course-manage.component';
import { EmpPermissionsComponent } from './emp-permissions/emp-permissions.component';
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
import { ToolbarModule } from 'primeng/toolbar';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ClientComponent } from './client/client.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { MultiSelectModule } from 'primeng/multiselect';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditCourseComponent } from './courselist/edit-course/edit-course.component';
@NgModule({
  declarations: [
    BackSystemComponent,
    CourseManageComponent,
    CourselistComponent,
    QuizzesManageComponent,
    EmpPermissionsComponent,
    CreateCourseComponent,
    BackDashboardComponent,
    DepManageComponent,
    CreateDepComponent,
    EmpManageComponent,
    CreateEmpComponent,
    ClientComponent,
    EditCourseComponent,
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
    ToolbarModule,
    CheckboxModule,
    ToastModule,
    PaginatorModule,
    RadioButtonModule,
    ToastModule,
    InputSwitchModule,
    ProgressBarModule,
    TabViewModule,
    PanelModule,
    AccordionModule,
    MultiSelectModule,
    DynamicDialogModule
  ],
  providers: [
    ConfirmationService,
    MessageService, // 如果你用到了 toast 或 growl 等通知功能，也要註冊這個
    DialogService
  ],
})
export class BackSystemModule { }
