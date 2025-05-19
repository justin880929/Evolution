import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourselistComponent } from "./courselist/courselist.component";
import { CreateCourseComponent } from "./create-course/create-course.component";
import { CourseGoalsComponent } from "./course-goals/course-goals.component";
import { CourseManageComponent } from "./course-manage/course-manage.component";
import { EmpPermissionsComponent } from "./emp-permissions/emp-permissions.component";
import { HashTagManageComponent } from "./hash-tag-manage/hash-tag-manage.component";
import { QuizzesManageComponent } from "./quizzes-manage/quizzes-manage.component";
import { BackSystemComponent } from './back-system.component';
import { BackDashboardComponent } from "./back-dashboard/back-dashboard.component";
const routes: Routes = [
  {
    path: '',
    component: BackSystemComponent,
    children: [
      { path: '', redirectTo: 'back-dashboard', pathMatch: 'full' }, // 後台預設導向課程總覽
      { path: 'back-dashboard', component: BackDashboardComponent },
      { path: 'course-list', component: CourselistComponent },
      { path: 'create-course', component: CreateCourseComponent },
      { path: 'course-manage', component: CourseManageComponent },
      { path: 'quizzes-manage', component: QuizzesManageComponent },
      { path: 'hash-tag-manage', component: HashTagManageComponent },
      { path: 'course-goals', component: CourseGoalsComponent },
      { path: 'emp-permissions', component: EmpPermissionsComponent }
    ]
  },
  {
    path: '',
    redirectTo: 'back-system',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'back-system'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackSystemRoutingModule { }
