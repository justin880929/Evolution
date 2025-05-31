import { Component, Input } from '@angular/core';
import { courseDTO } from 'src/app/Interface/courseDTO';
import { Router } from '@angular/router';


@Component({
  selector: 'app-learing-list',
  templateUrl: './learing-list.component.html',
  styleUrls: ['./learing-list.component.css']
})
export class LearingListComponent {
  @Input() course!: courseDTO;

  constructor(private router: Router) { }

  goToLearning(): void {
    console.log('goToLearning', this.course.id);
  }
}
