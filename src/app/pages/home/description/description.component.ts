import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent {
  constructor(private http: HttpClient) {

  }
  test() {
    console.log("click");

    this.http.get('https://localhost:7274/api/auth/whoami')
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => console.error('❌ 發生錯誤：', err)
      });
  }
}
