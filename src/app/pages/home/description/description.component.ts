import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import * as Isotope from 'isotope-layout';
import * as imagesLoaded from 'imagesloaded';

import { DescriptionService } from '../../../services/description.service';
import { CourseWithTagDto } from '../../../Interface/coursewithtagDTO';
import { HashTagListDto } from '../../../Interface/hashTagListDTO';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('isotopeContainer', { static: false }) isotopeContainer!: ElementRef<HTMLElement>;

  courses: CourseWithTagDto[] = [];
  tagList: HashTagListDto[] = [];
  companyCount = 0;
  userCount = 0;
  courseCount = 0;
  quizCount = 0;
  activeFilter = '*';

  private iso!: Isotope;
  private sub = new Subscription();

  constructor(private descriptionService: DescriptionService) {}

  ngOnInit(): void {
    // 同步取得 AboutInfo、隨機課程與標籤，一次訂閱
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
          this.courses = courses;
          this.tagList = tags;
        },
        err => console.error(err)
      )
    );
  }

  ngAfterViewInit(): void {
    // 等圖片載入完畢後，初始化 Isotope
    imagesLoaded(this.isotopeContainer.nativeElement, () => {
      this.iso = new Isotope(this.isotopeContainer.nativeElement, {
        itemSelector: '.isotope-item',
        layoutMode: 'masonry',
        transitionDuration: '0.4s'
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.iso?.destroy();
  }

  /** 給每個課程卡片的動態 class */
  getCourseClasses(course: CourseWithTagDto): string[] {
    return [
      'col-lg-4',
      'col-md-6',
      'isotope-item',
      ...course.tagIds.map(id => `filter-${id}`)
    ];
  }

  /** trackBy 提升 *ngFor* 性能 */
  trackByCourse(_idx: number, course: CourseWithTagDto): number {
    return course.courseId;
  }

  /** 點擊標籤篩選 */
  filter(filter: string): void {
    this.activeFilter = filter;
    this.iso.arrange({ filter: filter === '*' ? '*' : filter });
  }

  /** 導向課程詳細 */
  goToDetail(id: number): void {
    // 也可以改成 EventEmitter 由子元件處理
    // this.router.navigate(['/home/course-products/detail', id]);
  }
}
