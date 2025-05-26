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
@NgModule({
  declarations: [HomeComponent, DescriptionComponent, LearningComponent],
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
