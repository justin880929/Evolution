import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent {
  constructor(private AuthService: AuthService) {

  }
  test() {
    console.log(localStorage.getItem("refresh_token"));
    this.AuthService.refreshToken().subscribe({
      next: () => {
        console.log(localStorage.getItem("refresh_token"));
      },
      error: (err) => {
        console.log(err);

      }

    })
  }
}
