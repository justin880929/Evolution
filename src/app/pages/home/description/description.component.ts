import { DescriptionService } from './../../../services/description.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  companyCount = 0;
  userCount = 0;
  courseCount = 0;
  quizCount = 0;
  constructor(private http: HttpClient,
    private descriptionService : DescriptionService) {}

  test() {
    console.log("click");

    this.http.get('https://localhost:7274/api/auth/whoami')
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => console.error('❌ 發生錯誤：', err)
      });
  }

  ngOnInit(): void {
    this.descriptionService.getAboutInfo().subscribe(
      dto => {
        this.companyCount = dto.companyCount;
        this.userCount = dto.userCount;
        this.courseCount = dto.courseCount;
        this.quizCount = dto.quizCount;
      }
    );
    console.log(this.companyCount,this.courseCount);
  }

  ngAfterViewInit(): void {
  }
}
