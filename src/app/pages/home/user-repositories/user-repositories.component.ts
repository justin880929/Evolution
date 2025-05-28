import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-repositories',
  templateUrl: './user-repositories.component.html',
  styleUrls: ['./user-repositories.component.css'],
})
export class UserRepositoriesComponent {
  constructor(private router: Router) {}
  gotoLearning() {
    this.router.navigate(['/home/learning', 1]);
  }
}
