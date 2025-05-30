import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { JWTService } from '../Share/JWT/jwt.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


declare var Menu: any; // Sneat 的選單初始化函式
declare var Helpers: any; // Sneat 的輔助初始化（可選）

@Component({
  selector: 'app-back-system',
  templateUrl: './back-system.component.html',
  styleUrls: ['./back-system.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BackSystemComponent implements OnInit, OnDestroy {
  username = '使用者';
  role = '';
  userPhotoUrl = '';
  defaultPhoto = '';
  isLoggedIn = false;

  private scripts: HTMLScriptElement[] = [];

  constructor(
    private renderer: Renderer2,
    private jwtService: JWTService,
    private authService: AuthService,   // ← 注入 AuthService
    private router: Router,              // ← 注入 Router
    private location: Location
  ) {
    // 設定預設 fallback 圖
    this.defaultPhoto = this.location.prepareExternalUrl('assets/img/default-user.png');
  }

  async ngOnInit(): Promise<void> {
    try {
    const user = this.jwtService.UnpackJWT();
    this.isLoggedIn = !!user;

    if (user) {
      this.username = user.username;
      this.role     = user.role;
      // ← 這裡改成絕對路徑，開頭加斜線
      this.userPhotoUrl = '/assets/img/NoprofilePhoto.png.png';
    } else {
      // 同樣用絕對路徑
      this.userPhotoUrl = '/assets/img/default-user.png';
    }

      // 1. 初始化設定與輔助工具
      await this.loadScript('assets/BackSystem/js/config.js');
      await this.loadScript('assets/BackSystem/js/helpers.js');

      // 2. 基本核心庫
      await this.loadScript('assets/BackSystem/js/jquery/jquery.js');
      await this.loadScript('assets/BackSystem/js/popper/popper.js');
      await this.loadScript('assets/BackSystem/js/bootstrap.js');

      // 3. UI 擴充組件
      await this.loadScript('assets/BackSystem/libs/perfect-scrollbar/perfect-scrollbar.js');
      await this.loadScript('assets/BackSystem/js/menu.js'); // ⬅️ Menu 載入完成點

      // 4. ApexCharts
      await this.loadScript('assets/BackSystem/libs/apex-charts/apexcharts.js');

      // 5. 主要行為與儀表板
      await this.loadScript('assets/BackSystem/js/main.js');
      await this.loadScript('assets/BackSystem/js/dashboards-analytics.js');

      console.log('✅ 所有腳本載入完成');

      const globalWin = window as any;
      if (globalWin.Menu && typeof globalWin.Menu.init === 'function') {
        globalWin.Menu.init();
        console.log('✅ Menu.init() 執行完成');
      }

      if (
        globalWin.Helpers &&
        typeof globalWin.Helpers.initCustomOptionCheck === 'function'
      ) {
        globalWin.Helpers.initCustomOptionCheck();
        console.log('✅ Helpers.initCustomOptionCheck() 執行完成');
      }
    } catch (err) {
      console.error('❌ Script loading error:', err);
    }
  }

  readonly menuItems = {
    course: [
      { label: '課程總覽', link: 'course-list' },
      { label: '建立課程', link: 'create-course' },
      { label: '課程章節管理', link: 'course-manage' },
      { label: '測驗管理', link: 'quizzes-manage' },
      { label: '標籤管理', link: 'hash-tag-manage' },
      { label: '課程目標設定', link: 'course-goals' },
      { label: '課程權限管理', link: 'emp-permissions' },
    ],
    EmpDep: [
      { label: '部門管理', link: 'dep-manage' },
      { label: '建立部門', link: 'create-dep' },
      { label: '員工管理', link: 'emp-manage' },
      { label: '建立員工帳號', link: 'create-emp' },
    ],
  };

  loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        console.warn(`Script already loaded: ${src}`);
        return resolve();
      }

      const script = this.renderer.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.defer = true;

      script.onload = () => {
        console.log(`✅ Script loaded: ${src}`);
        resolve();
      };

      script.onerror = () => {
        console.error(`❌ Failed to load script: ${src}`);
        reject(new Error(`Script load failed: ${src}`));
      };

      this.renderer.appendChild(document.body, script);
      this.scripts.push(script);
    });
  }

  ngOnDestroy(): void {
    this.scripts.forEach((script) => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    this.scripts = [];
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout().subscribe({
      next: () => {
        // 登出後切換到登入頁或首頁
        this.router.navigateByUrl('/home');
      },
      error: () => {
        this.router.navigateByUrl('/home');
      },
    });
  }
}
