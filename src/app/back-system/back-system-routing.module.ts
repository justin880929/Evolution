import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourselistComponent } from './courselist/courselist.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { CourseManageComponent } from './course-manage/course-manage.component';
import { EmpPermissionsComponent } from './emp-permissions/emp-permissions.component';
import { QuizzesManageComponent } from './quizzes-manage/quizzes-manage.component';
import { BackSystemComponent } from './back-system.component';
import { BackDashboardComponent } from './back-dashboard/back-dashboard.component';
import { CreateDepComponent } from './create-dep/create-dep.component';
import { DepManageComponent } from './dep-manage/dep-manage.component';
import { CreateEmpComponent } from './create-emp/create-emp.component';
import { EmpManageComponent } from './emp-manage/emp-manage.component';
import { UserComponent } from '../pages/home/user/user.component';
import { ClientComponent } from './client/client.component';

const routes: Routes = [
  {
    path: '',
    component: BackSystemComponent,
    children: [
      { path: 'back-dashboard', component: BackDashboardComponent },
      {
        path: 'course-list', component: CourselistComponent,
        data: { breadcrumb: ['課程管理', '課程列表'] }
      },
      {
        path: 'create-course', component: CreateCourseComponent,
        data: { breadcrumb: ['課程管理', '建立課程'] }
      },
      {
        path: 'course-manage', component: CourseManageComponent,
        data: { breadcrumb: ['課程管理', '課程內容管理'] }
      },
      {
        path: 'quizzes-manage', component: QuizzesManageComponent,
        data: { breadcrumb: ['課程管理', '測驗管理'] }
      },
      {
        path: 'emp-permissions', component: EmpPermissionsComponent,
        data: { breadcrumb: ['課程管理', '員工權限管理'] }
      },
      {
        path: 'dep-manage', component: DepManageComponent,
        data: { breadcrumb: ['部門與員工管理', '部門管理'] }
      },
      {
        path: 'create-dep', component: CreateDepComponent,
        data: { breadcrumb: ['部門與員工管理', '建立員工'] }
      },
      {
        path: 'emp-manage', component: EmpManageComponent,
        data: { breadcrumb: ['部門與員工管理', '員工管理'] }
      },
      {
        path: 'create-emp', component: CreateEmpComponent,
        data: { breadcrumb: ['部門與員工管理', '建立部門'] }
      },
      { path: 'client', component: ClientComponent },
    ],
  },
  {
    path: '',
    redirectTo: 'back-system',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'back-system',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackSystemRoutingModule { }
