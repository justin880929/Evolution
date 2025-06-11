import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import * as Isotope from 'isotope-layout';
// import * as imagesLoaded from 'imagesloaded';
import imagesLoaded from 'imagesloaded/imagesloaded.pkgd.js';

import { DescriptionService } from '../../../services/description.service';
import { CourseWithTagDto } from '../../../Interface/coursewithtagDTO';
import { HashTagListDto } from '../../../Interface/hashTagListDTO';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('isotopeContainer') isotopeContainer!: ElementRef<HTMLElement>;
  @ViewChildren('courseItem') courseItems!: QueryList<ElementRef>;

  courses: CourseWithTagDto[] = [];
  tagList: HashTagListDto[] = [];
  companyCount = 0;
  userCount = 0;
  courseCount = 0;
  quizCount = 0;
  activeFilter = '*';

  private iso!: Isotope;
  private sub = new Subscription();

  constructor(
    private descriptionService: DescriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {

     if (!sessionStorage.getItem('homeReloaded')) {
      sessionStorage.setItem('homeReloaded', 'true');
      // 立刻重新整理整個頁面
      window.location.reload();
      return; // 跳過下面的初始化，等 reload 之後再跑一次
    }
    // 一次打三個 API，資料一到就更新列表、若 isotope 已 init 就重排
    this.sub.add(
      forkJoin({
        about: this.descriptionService.getAboutInfo(),
        courses: this.descriptionService.getRandomCourses(),
        tags: this.descriptionService.getRandomTag()
      }).subscribe(
        ({ about, courses, tags }) => {
          this.companyCount = about.companyCount;
          this.userCount    = about.userCount;
          this.courseCount  = about.courseCount;
          this.quizCount    = about.quizCount;
          this.courses      = courses;
          this.tagList      = tags;
          if (this.iso) {
            this.iso.reloadItems();
            this.iso.layout();
          }
        },
        err => console.error(err)
      )
    );
  }

  ngAfterViewInit(): void {
  // 首次初始化
  imagesLoaded(this.isotopeContainer.nativeElement, () => {
    this.iso = new Isotope(this.isotopeContainer.nativeElement, {
      itemSelector: '.isotope-item',
      layoutMode: 'masonry',
      transitionDuration: '0.4s'
    });

    // 用 courseItems.changes 確保篩選時也能重排
    this.courseItems.changes.subscribe(() => {
      if (this.iso) {
        imagesLoaded(this.isotopeContainer.nativeElement, () => {
          this.iso.reloadItems();
          this.iso.layout();
        });
      }
    });

    // 監聽 NavigationEnd，只有在 URL 包含 /home/description 時才重排
    this.sub.add(
      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      ).subscribe(evt => {
        if (evt.urlAfterRedirects.includes('/home/description')) {
          window.scrollTo(0, 0);
          imagesLoaded(this.isotopeContainer.nativeElement, () => {
            this.iso.reloadItems();
            this.iso.arrange({ filter: this.activeFilter === '*' ? '*' : this.activeFilter });
          });
        }
      })
    );
  });

  // 篩選或資料變動時也要重排
  this.courseItems.changes.subscribe(() => {
    if (this.iso) {
      imagesLoaded(this.isotopeContainer.nativeElement, () => {
        this.iso.reloadItems();
        this.iso.layout();
      });
    }
  });
}


  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.iso?.destroy();
    sessionStorage.removeItem('homeReloaded');
  }

  getCourseClasses(course: CourseWithTagDto): string[] {
    return [
      'col-lg-4','col-md-6','isotope-item',
      ...course.tagIds.map(id => `filter-${id}`)
    ];
  }

  trackByCourse(_i: number, c: CourseWithTagDto): number {
    return c.courseId;
  }

  filter(f: string): void {
    this.activeFilter = f;
    this.iso.arrange({ filter: f === '*' ? '*' : f });
  }

  goToDetail(id: number): void {
    // this.router.navigate(['/home/course-products/detail', id]);
  }
}
