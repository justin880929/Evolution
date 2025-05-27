import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent {
  @Input() isLoggedIn = false;
  @Input() username = '訪客';
  userPhotoUrl = '../../../assets/img/EvolutionLogo.png';

  constructor(private router: Router) { }

  logout(): void {
    console.log('使用者登出中...');
    localStorage.clear();
    sessionStorage.clear();

    // 強制導向首頁並觸發刷新
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home']);
    });
  }
}
