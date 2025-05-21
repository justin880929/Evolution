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
import { FormsModule } from '@angular/forms';
import { BackDashboardComponent } from './back-dashboard/back-dashboard.component';
import { DepManageComponent } from './dep-manage/dep-manage.component';
import { CreateDepComponent } from './create-dep/create-dep.component';
import { EmpManageComponent } from './emp-manage/emp-manage.component';
import { CreateEmpComponent } from './create-emp/create-emp.component';

@NgModule({
  declarations: [
    BackSystemComponent,
    CourseGoalsComponent,
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
  imports: [CommonModule, BackSystemRoutingModule, RouterModule, FormsModule],
})
export class BackSystemModule {}
