import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import AOS from '../../../assets/FrontSystem/vendor/aos/aos.js';
import GLightbox from '../../../assets/FrontSystem/vendor/glightbox/js/glightbox.js';
import PureCounter from '../../../assets/FrontSystem/vendor/purecounter/purecounter_vanilla.js';
import imagesLoaded from '../../../assets/FrontSystem/vendor/imagesloaded/imagesloaded.pkgd.min.js';
import Isotope from '../../../assets/FrontSystem/vendor/isotope-layout/isotope.pkgd.js';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private scrollHandler = this.toggleScrolled.bind(this);
  private scrollTopHandler = this.toggleScrollTop.bind(this);
  isLoggedIn: boolean = false;
  username: string = '';
  userPhotoUrl = '../../../assets/img/EvolutionLogo.png'; // 預設使用者頭像

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('jwt');
    this.isLoggedIn = !!token;

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.username =
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
          decoded['name'] ||
          '使用者';
      } catch {
        this.username = '使用者';
      }
    }
  }

  ngAfterViewInit(): void {
    this.initPreloader();
    this.initScrollEvents();
    this.initMobileNav();
    this.initScrollTopButton();
    this.initAOS();
    this.initGLightbox();
    this.initPureCounter();
    this.initIsotope();
  }

  ngOnDestroy(): void {
    // 移除所有事件監聽，避免記憶體洩漏
    document.removeEventListener('scroll', this.scrollHandler);
    document.removeEventListener('scroll', this.scrollTopHandler);
    window.removeEventListener('load', this.scrollHandler);
  }

  // === Preloader ===
  private initPreloader(): void {
    const preloader = document.querySelector('#preloader');
    if (preloader) {
      // 建議這邊改為 fadeOut 效果或直接使用 *ngIf 控制
      setTimeout(() => preloader.remove(), 300); // 延遲一點讓效果更自然
    }
  }

  // === 滾動變化 ===
  private toggleScrolled(): void {
    const body = document.querySelector('body');
    const header = document.querySelector('#header');
    if (!body || !header) return;

    const isSticky =
      header.classList.contains('scroll-up-sticky') ||
      header.classList.contains('sticky-top') ||
      header.classList.contains('fixed-top');

    if (!isSticky) return;

    window.scrollY > 100
      ? body.classList.add('scrolled')
      : body.classList.remove('scrolled');
  }

  private initScrollEvents(): void {
    document.addEventListener('scroll', this.scrollHandler);
    window.addEventListener('load', this.scrollHandler);
  }

  // === Scroll-to-top 按鈕 ===
  private toggleScrollTop(): void {
    const scrollTopBtn = document.querySelector('.scroll-top') as HTMLElement;
    if (!scrollTopBtn) return;

    window.scrollY > 100
      ? scrollTopBtn.classList.add('active')
      : scrollTopBtn.classList.remove('active');
  }

  private initScrollTopButton(): void {
    const scrollTopBtn = document.querySelector('.scroll-top') as HTMLElement;
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    document.addEventListener('scroll', this.scrollTopHandler);
    window.addEventListener('load', this.scrollTopHandler);
  }

  // === 手機版導覽列 ===
  private initMobileNav(): void {
    const toggleBtn = document.querySelector(
      '.mobile-nav-toggle'
    ) as HTMLElement;
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('mobile-nav-active');
        toggleBtn.classList.toggle('bi-list');
        toggleBtn.classList.toggle('bi-x');
      });
    }

    document.querySelectorAll('#navmenu a').forEach((link) => {
      link.addEventListener('click', () => {
        if (document.body.classList.contains('mobile-nav-active')) {
          toggleBtn?.click();
        }
      });
    });

    document
      .querySelectorAll('.navmenu .toggle-dropdown')
      .forEach((dropdown) => {
        dropdown.addEventListener(
          'click',
          function (this: HTMLElement, e: Event) {
            e.preventDefault();
            const parent = this.parentElement;
            const nextSibling = parent?.nextElementSibling;
            parent?.classList.toggle('active');
            nextSibling?.classList.toggle('dropdown-active');
            e.stopImmediatePropagation();
          }
        );
      });
  }

  // === AOS ===
  private initAOS(): void {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }

  // === GLightbox ===
  private initGLightbox(): void {
    GLightbox({ selector: '.glightbox' });
  }

  // === PureCounter ===
  private initPureCounter(): void {
    new PureCounter();
  }

  // === Isotope + Filter ===
  private initIsotope(): void {
    setTimeout(() => {
      const isotopeLayouts = document.querySelectorAll('.isotope-layout');

      isotopeLayouts.forEach((layout) => {
        const container = layout.querySelector('.isotope-container');
        if (!container) return;

        const layoutMode = layout.getAttribute('data-layout') ?? 'masonry';
        const filter = layout.getAttribute('data-default-filter') ?? '*';
        const sortBy = layout.getAttribute('data-sort') ?? 'original-order';

        imagesLoaded(container, () => {
          const iso = new Isotope(container, {
            itemSelector: '.isotope-item',
            layoutMode,
            filter,
            sortBy,
          });

          layout.querySelectorAll('.isotope-filters li').forEach((li) => {
            li.addEventListener('click', () => {
              layout
                .querySelector('.filter-active')
                ?.classList.remove('filter-active');
              li.classList.add('filter-active');
              iso.arrange({ filter: li.getAttribute('data-filter') });
              this.initAOS(); // 重新觸發動畫
            });
          });
        });
      });
    }, 300); // 可依據圖片載入調整延遲時間
  }

  logout(): void {
    console.log('🔁 登出中...');
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('refreshToken');
        this.isLoggedIn = false;
        this.username = '';
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
