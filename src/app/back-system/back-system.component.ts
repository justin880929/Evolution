import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-back-system',
  templateUrl: './back-system.component.html',
  styleUrls: ['./back-system.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BackSystemComponent implements OnInit {
  private scripts: HTMLScriptElement[] = [];
  constructor(private renderer: Renderer2) { }

  async ngOnInit(): Promise<void> {
    try {
      // 1. 初始化設定與輔助工具
      await this.loadScript('assets/BackSystem/js/config.js');
      await this.loadScript('assets/BackSystem/js/helpers.js');

      // 2. 基本核心庫
      await this.loadScript('assets/BackSystem/js/jquery/jquery.js');
      await this.loadScript('assets/BackSystem/js/popper/popper.js');
      await this.loadScript('assets/BackSystem/js/bootstrap.js');

      // 3. UI 擴充組件
      await this.loadScript('assets/BackSystem/libs/perfect-scrollbar/perfect-scrollbar.js');
      await this.loadScript('assets/BackSystem/js/menu.js');

      // 4. ApexCharts → 先載入核心 lib
      await this.loadScript('assets/BackSystem/libs/apex-charts/apexcharts.js');

      // 5. 主要行為與儀表板
      await this.loadScript('assets/BackSystem/js/main.js');
      await this.loadScript('assets/BackSystem/js/dashboards-analytics.js');

      console.log('✅ 所有腳本載入完成');
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
    // 清除動態 script 標籤
    this.scripts.forEach((script) => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    this.scripts = [];
  }
}
