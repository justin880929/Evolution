import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
@NgModule({
  declarations: [AppComponent, ForgotComponent, ResetPasswordComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule, // ✅ 只匯入這裡
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
