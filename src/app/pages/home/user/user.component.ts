import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { courseDTO } from 'src/app/Interface/courseDTO';
import { UserDTO } from 'src/app/Interface/userDTO';
import { CourseService } from 'src/app/services/course.service/course.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user!: UserDTO;
  errorMsg: string | null = null;
  private sub!: Subscription;

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0 });
  }

  courses: courseDTO[] = [];

  constructor(private courseService: CourseService,private userService:UserService) { }

  ngOnInit(): void {

  this.courseService.getCourses().subscribe(data => {
    this.courses = data;
  });

   // 直接傳參數 id，或改用 JWT 解出的 userId (service 裡面已處理)
    this.sub = this.userService.getUserInfo().subscribe({
      next: (data: UserDTO) => {
        this.user = data;
      },
      error: (err) => {
        console.error('取得使用者資訊失敗：', err);
        this.errorMsg = '無法取得使用者資訊，請稍後再試。';
      }
    });
}
ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
