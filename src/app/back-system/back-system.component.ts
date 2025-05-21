import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-back-system',
  templateUrl: './back-system.component.html',
  styleUrls: ['./back-system.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BackSystemComponent implements OnInit {
  private scripts: HTMLScriptElement[] = [];
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadScript('assets/BackSystem/js/config.js');
    this.loadScript('assets/BackSystem/js/helpers.js');
    this.loadScript('assets/BackSystem/js/jquery/jquery.js');
    this.loadScript('assets/BackSystem/js/popper/popper.js');
    this.loadScript('assets/BackSystem/js/bootstrap.js');
    this.loadScript(
      'assets/BackSystem/libs/perfect-scrollbar/perfect-scrollbar.js'
    );
    this.loadScript('assets/BackSystem/js/menu.js');
    this.loadScript('assets/BackSystem/libs/apex-charts/apexcharts.js');
    this.loadScript('assets/BackSystem/js/main.js');
    this.loadScript('assets/BackSystem/js/dashboards-analytics.js');
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
  // readonly menuItems = [
  //   { label: '課程總覽', link: 'course-list' },
  //   { label: '建立課程', link: 'create-course' },
  //   { label: '課程章節管理', link: 'course-manage' },
  //   { label: '測驗管理', link: 'quizzes-manage' },
  //   { label: '標籤管理', link: 'hash-tag-manage' },
  //   { label: '課程目標設定', link: 'course-goals' },
  //   { label: '課程權限管理', link: 'emp-permissions' },
  // ];
  //   ✅ 儀表板
  // 總覽（可視品牌與公司看到不同 KPI、登入紀錄等）

  // ✅ 課程管理
  // 課程清單

  // 建立新課程（含章節、封面、價錢、內容）

  // 課程章節管理

  // 測驗管理

  // 標籤管理

  // 課程目標設定

  // 學員權限管理

  // ✅ 使用者與部門
  // 部門管理

  // 建立部門

  // 員工管理（學員）

  // 建立員工帳號

  // ✅ 統計分析
  // 課程學習率分析

  // 員工學習進度

  // 各公司目標完成率（若品牌可看所有合作公司）

  // （可選）✅ 系統管理
  // 公司資料維護

  // 品牌公告

  // 後台登入紀錄

  // 系統通知 / 消息推播

  loadScript(src: string): void {
    const script = this.renderer.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.defer = true;
    this.renderer.appendChild(document.body, script);
    this.scripts.push(script); // 儲存起來
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
