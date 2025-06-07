import { Component, OnInit, HostListener } from '@angular/core';
import { CourseDto } from 'src/app/Interface/courseDTO';
import { ApiResponse } from 'src/app/Share/interface/resultDTO';
import { PagedResult } from 'src/app/Interface/pagedResult';
import { CourseService } from 'src/app/services/course.service/course.service';

@Component({
  selector: 'app-course-products',
  templateUrl: './course-products.component.html',
  styleUrls: ['./course-products.component.css']
})
export class CourseProductsComponent implements OnInit {
  courses: CourseDto[] = [];           // 已載入的所有課程
  filteredCourses: CourseDto[] = [];   // 搜尋後結果
  searchText = '';

  // 分頁／無限滾動狀態
  pageIndex = 0;
  pageSize = 20;
  totalCount = 0;
  hasMore = true;
  isLoading = false;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadNextPage();
  }

  /** 偵測滾動事件，自動載入下一頁 */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const threshold = 100; // 距離底部 threshold
    const position = window.innerHeight + window.scrollY;
    const height = document.body.offsetHeight;

    if (position >= height - threshold && this.hasMore) {
      this.loadNextPage();
    }
  }

  /** 載入下一頁資料並更新快取 */
  loadNextPage(): void {
    if (!this.hasMore || this.isLoading) return;

    this.isLoading = true;
    this.courseService
      .getCoursesPaged(this.pageIndex, this.pageSize)
      .subscribe({
        next: res => {
          if (res.success && res.data) {
            const paged = res.data;
            this.courses.push(...paged.items);
            this.filteredCourses = [...this.courses];
            this.totalCount = paged.totalCount;
            this.pageIndex++;
            this.hasMore = this.courses.length < this.totalCount;
          }
        },
        error: err => console.error(err),
        complete: () => this.isLoading = false  // 重置標誌
      });
  }

  /** 關鍵字搜尋（只在已載入資料中） */
  onSearch(): void {
    const keyword = this.searchText.toLowerCase().trim();

    this.filteredCourses = this.courses.filter(course =>
      course.courseTitle.toLowerCase().includes(keyword) ||
      (course.courseDes  ?? '').toLowerCase().includes(keyword) ||
      (course.companyName ?? '').toLowerCase().includes(keyword)
    );
  }
}
