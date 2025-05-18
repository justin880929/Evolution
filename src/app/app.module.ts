import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { BackSystemComponent } from './back-system/back-system.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
const routes: Routes = [
  {
    path: 'back-system',
    component: BackSystemComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    // 預設導向
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
  // {
  //   path: '**',
  //   redirectTo: '/back-system'
  // } // 404 也導向
];
@NgModule({
  declarations: [
    AppComponent,
    BackSystemComponent,
    HomeComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
