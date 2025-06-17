import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, map, Observable, throwError, filter, firstValueFrom } from 'rxjs';
import { ResCourseBgListDTO, HashTagListDTO } from 'src/app/Interface/CourseListDTO';
import { ApiResponse } from 'src/app/Share/interface/resultDTO';
import { DialogService } from 'primeng/dynamicdialog';
import { EditCourseComponent } from "./edit-course/edit-course.component";
@Component({
  selector: 'app-courselist',
  templateUrl: './courselist.component.html',
  styleUrls: ['./courselist.component.css']
})
export class CourselistComponent {
  constructor(private http: HttpClient, private dialogService: DialogService) { }
  CourseList!: ResCourseBgListDTO[];
  HashTagList!: HashTagListDTO[];
  FilteredHashTags!: HashTagListDTO[];
  CourseListUrl = 'https://localhost:7274/api/courseBgList'
  HashTagListUrl = "https://localhost:7274/api/HashTagList"
  searchKeyword: string = '';
  selectedHashTag: number | null = null;
  selectedPublicStatus: boolean | null = null;

  FilteredCourseList: ResCourseBgListDTO[] = [];
  async ngOnInit(): Promise<void> {
    try {
      await this.getCourseListAPI();
      await this.getHashTagList();
      this.buildFilteredHashTags();
      this.FilteredCourseList = this.CourseList; // 預設全部顯示
    } catch (error) {
      console.error('初始化失敗', error);
    }
  }
  openEditDialog(courseId: number) {
    this.dialogService.open(EditCourseComponent, {
      header: '編輯課程',
      width: '70%',
      data: {
        courseId: courseId
      },
      baseZIndex: 10000,
      maximizable: true
    });
  }
  filterCourses() {
    this.FilteredCourseList = this.CourseList.filter(course => {
      const matchesKeyword = !this.searchKeyword || course.courseTitle.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const matchesHashTag = !this.selectedHashTag || course.courseHashTags.includes(this.selectedHashTag);
      const matchesPublic = this.selectedPublicStatus === null || course.isPublic === this.selectedPublicStatus;

      return matchesKeyword && matchesHashTag && matchesPublic;
    });
  }
  async getCourseListAPI(): Promise<void> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<ResCourseBgListDTO[]>>(this.CourseListUrl)
    );
    this.CourseList = res.data!.map(course => ({
      ...course,
      courseHashTag: course.courseHashTags ?? []
    }));

  }
  async getHashTagList(): Promise<void> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<HashTagListDTO[]>>(this.HashTagListUrl)
    );
    this.HashTagList = res.data!;

  }
  buildFilteredHashTags() {
    // 👉 合併所有課程的 hashTagIds
    const usedTagIds = new Set<number>();
    this.CourseList.forEach(course => {
      course.courseHashTags.forEach(tagId => usedTagIds.add(tagId));
    });
    // 👉 篩選實際有用到的 HashTag 資料
    this.FilteredHashTags = this.HashTagList.filter(tag => usedTagIds.has(tag.hashTagId));
  }
}
