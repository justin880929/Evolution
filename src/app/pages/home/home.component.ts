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
import { AuthService } from '../../services/auth.service';
import { NavigationEnd } from '@angular/router';
import { JWTService } from '../../Share/JWT/jwt.service';
import { catchError, filter, of, Subscription, switchMap } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { UserService } from 'src/app/services/user.service';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private scrollHandler = this.toggleScrolled.bind(this);
  private scrollTopHandler = this.toggleScrollTop.bind(this);
  private userSub!: Subscription;

  cartCount = 0;
  isLoggedIn = false;
  username = '';
  userPhotoUrl = '../../../assets/img/NoprofilePhoto.png';
  userRole = '';
  isAdmin = false;

  private loginSub!: Subscription;
  private routerSub!: Subscription;
  private cartSub!: Subscription;


  constructor(
    private authService: AuthService,
    private jwtService: JWTService,
    private userService: UserService,
    private router: Router,
    private cartService: CartService,
  ) { }

  ngOnInit(): void {
    // 1. 訂閱購物車數量
    this.cartSub = this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });

    // 2. 訂閱 AuthService 登入狀態，只用來設定 isLoggedIn、userRole、isAdmin，並不再去 getUserInfo()
    this.loginSub = this.authService.isLoggedIn$.subscribe((flag) => {
      this.isLoggedIn = flag;
      if (flag) {
        // 從 JWT 解析 username / role
        const payload = this.jwtService.UnpackJWT();
        this.username = payload?.username ?? '使用者';
        this.userRole = payload?.role ?? '';
        const roleLower = this.userRole.toLowerCase();
        this.isAdmin = roleLower === 'admin' || roleLower === 'superadmin';
      } else {
        // 登出時重置
        this.username = '';
        this.userRole = '';
        this.isAdmin = false;
        this.userPhotoUrl = 'assets/img/NoprofilePhoto.png';
      }
    });

    // 3. **訂閱 userService.user$**：凡是 Service 裡有 next()，這邊都會收到
    this.userSub = this.userService.user$.subscribe((userDto) => {
      if (userDto) {
        this.username = userDto.name;
        this.userPhotoUrl = userDto.pic || 'assets/img/NoprofilePhoto.png';
      } else {
        // 如果你想讓載入初始值時 userSubject 為 null，就顯示預設
        // this.username = '';
        // this.userPhotoUrl = 'assets/img/NoprofilePhoto.png';
      }
    });

    // 4. **如果需要一進入 HomeComponent 就拉一次 userInfo**，可以直接呼叫
    //    （通常已在 AppComponent 一開始就 loadUserInfo()，此處可略過）
    // if (!this.isLoggedIn) {
    //   return;
    // }
    // this.userService.refreshUserInfo();
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

    this.loginSub?.unsubscribe();
    this.routerSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }

  /** 讓外部新增完商品後，也可以呼叫這個方法同步更新 badge */
  updateCartCount(): void {
    this.cartCount = this.cartService.getCartCount();
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

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout().subscribe({
      next: () => {
        // 登出後切換到登入頁或首頁
        this.router.navigateByUrl('home');
      },
      error: () => {
        this.router.navigateByUrl('home');
      },
    });
  }

  toggleSubmenu(event: MouseEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    const parent = target.parentElement;
    const submenu = parent?.querySelector('.dropdown-menu');
    submenu?.classList.toggle('show');
  }
}
