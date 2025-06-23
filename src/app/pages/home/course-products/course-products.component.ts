import { Component, OnInit, HostListener } from '@angular/core';
import { CourseDto } from 'src/app/Interface/courseDTO';
import { ApiResponse } from 'src/app/Share/interface/resultDTO';
import { PagedResult } from 'src/app/Interface/pagedResult';
import { CourseService } from 'src/app/services/course.service/course.service';
import {
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-course-products',
  templateUrl: './course-products.component.html',
  styleUrls: ['./course-products.component.css'],
})
export class CourseProductsComponent implements OnInit {
  courses: CourseDto[] = []; // 已載入的所有課程
  filteredCourses: CourseDto[] = []; // 搜尋後結果
  suggestions: string[] = [];
  searchText = '';

  private searchTerm$ = new Subject<string>();

  // 分頁／無限滾動狀態
  pageIndex = 0;
  pageSize = 20;
  totalCount = 0;
  hasMore = true;
  isLoading = false;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadNextPage();

    // 訂閱 input 變化，300ms 防抖，字數 ≥2 時呼叫 suggestions API
    this.searchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) =>
          term.length >= 2 ? this.courseService.getSuggestions(term) : of([])
        )
      )
      .subscribe((list) => (this.suggestions = list));
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
        next: (res) => {
          if (res.success && res.data) {
            const paged = res.data;
            this.courses.push(...paged.items);
            this.filteredCourses = [...this.courses];
            this.totalCount = paged.totalCount;
            this.pageIndex++;
            this.hasMore = this.courses.length < this.totalCount;

            if (!this.searchText.trim()) {
              this.filteredCourses = [...this.courses];
            }
          }
        },
        error: (err) => console.error(err),
        complete: () => (this.isLoading = false), // 重置標誌
      });
  }

  /** input 每次改變就推到 subject */
  onSearchTextChange(term: string) {
    this.searchText = term;

    if (!term.trim()) {
      // 清空時：重置並重新載入全部課程
      this.resetCourses();
      return;
    }

    // 有文字才去做 suggestions
    this.searchTerm$.next(term);
  }

  /** 重置所有狀態，並重新從第 0 頁載入 */
  private resetCourses(): void {
    // 先取消 suggestions
    this.suggestions = [];

    // 重置分頁狀態
    this.courses = [];
    this.filteredCourses = [];
    this.pageIndex = 0;
    this.hasMore = true;

    // 重新載第一頁
    this.loadNextPage();
  }

  /** 點選建議時 */
  selectSuggestion(title: string) {
    this.searchText = title;
    this.suggestions = [];
    this.onSearch(); // 可立即搜尋
  }

  /** 按下搜尋鈕呼叫後端完整搜尋 */
  onSearch(): void {
    this.suggestions = [];
    const q = this.searchText.trim();
    if (!q) {
      this.resetCourses();
      return;
    }

    // 關掉無限滾動
    this.hasMore = false;

    this.courseService.searchCourses(q).subscribe((results) => {
      this.filteredCourses = results;
      // 捲回頂端，避免再次觸發滾動加載
      window.scrollTo({ top: 0 });
    });
  }
}
