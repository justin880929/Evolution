import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EmpOrderDTO } from 'src/app/Interface/empOrderDTO';


@Component({
  selector: 'app-learing-list',
  templateUrl: './learing-list.component.html',
  styleUrls: ['./learing-list.component.css']
})
export class LearingListComponent {
  @Input() course!: EmpOrderDTO;

  constructor(private router: Router) { }

  goToLearning(): void {
    this.router.navigate(['/home/learning', this.course.courseId]);
  }

}
