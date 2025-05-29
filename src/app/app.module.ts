import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CourseProductPipe } from './Pipe/course-product.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StatusToTagPipe } from './Pipe/emp.pipe';
import { InterceptorService } from "./Share/Interceptor/interceptor.service";
@NgModule({
  declarations: [
    AppComponent,
    ForgotComponent,
    ResetPasswordComponent,
    LoginComponent,
    CourseProductPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StatusToTagPipe,
  ],
  exports: [
    StatusToTagPipe, // 匯出給其他模組使用（如 BackSystemModule）
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
})
export class AppModule { }
