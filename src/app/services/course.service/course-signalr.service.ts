import { JWTService } from './../../Share/JWT/jwt.service';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ResultService } from 'src/app/Share/result.service';

import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import {
  ResCourseDTO,
  ReqChapterDTO,
  ResChapterDTO,
  ResVideoDTO,
  RePutDTO,
  chapterDTO,
  videoDTO,
  ReqFinalDTO,
} from 'src/app/Interface/createCourseDTO';
import {
  ResDepDTO,
  ResHashTagDTO,
  ReqCourseAccessDTO,
  ReqCourseHashTagDTO,
  ResCourseAllDetailsDTO
} from 'src/app/Interface/createCourseDTO';
@Injectable({
  providedIn: 'root',
})
export class CourseSignalrService {
  private hubConnection?: signalR.HubConnection;

  constructor(
    private resultService: ResultService,
    private jwtService: JWTService
  ) { }
  CourseUrl = 'https://localhost:7274/api/createcourse';
  ChapterUrl = 'https://localhost:7274/api/chapter';
  VideoUrl = 'https://localhost:7274/api/video';
  DepListUrl = 'https://localhost:7274/api/deplist';
  HashTagListUrl = 'https://localhost:7274/api/hashtaglist';
  CourseAccessUrl = 'https://localhost:7274/api/CourseAccess';
  CourseHashTagUrl = 'https://localhost:7274/api/CourseHashTag';
  CourseAllDetails = 'https://localhost:7274/api/createcourse/learn';
  CourseFinal = 'https://localhost:7274/api/createcourse/final';
  connectionId = '';
  // 在 Service 裡加上：
  private progressSubject = new BehaviorSubject<{
    step: string;
    data: any;
    clientRequestId?: string;
  } | null>(null);
  progress$ = this.progressSubject.asObservable();

  async connect(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7274/courseHub')
      .withAutomaticReconnect()
      .build();

    try {
      await this.hubConnection.start();
      console.log('✅ SignalR 已連線');

      // 呼叫後端方法取得 connectionId
      const connectionId = await this.hubConnection.invoke<string>(
        'GetConnectionId'
      );
      console.log('前端自己的 ConnectionId:', connectionId);

      // 可以存在 service 方便後續使用
      this.connectionId = connectionId;
    } catch (err) {
      console.error('❌ SignalR 連線失敗', err);
    }

    this.hubConnection.on('ReceiveProgress', (update) => {
      console.log('📩 收到推播', update.step, update.data);
      this.progressSubject.next(update);
    });
  }

  //獲取課程
  getCourse(ID: number): Observable<ResCourseDTO> {
    return this.resultService.getResult<ResCourseDTO>(
      `${this.CourseUrl}/${ID}`
    );
  }

  //新增課程
  postCourse(
    courseForm: FormGroup,
    clientRequestId: string
  ): Observable<number> {
    console.log(courseForm.value);

    const file = courseForm.get('CoverImage')?.value;
    if (file == null) {
      return throwError(() => new Error('沒有上傳檔案'));
    }
    if (!(file instanceof File)) {
      console.error('❌ 圖片不是合法的檔案');
      return throwError(() => new Error('❌ 封面上傳欄位不是合法的檔案類型'));
    }
    // 圖片格式驗證（僅允許 jpg 和 png）
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      console.error('❌ 圖片格式錯誤，只允許 jpg 或 png');
      return throwError(
        () => new Error('❌ 圖片格式錯誤，僅支援 .jpg 與 .png')
      );
    }

    const formData = new FormData();
    formData.append('clientRequestId', clientRequestId);
    formData.append('ConnectionId', this.connectionId);
    formData.append('CompanyId', courseForm.get('CompanyId')?.value.toString());
    formData.append('CourseTitle', courseForm.get('CourseTitle')?.value);
    formData.append('CourseDes', courseForm.get('CourseDes')?.value);
    formData.append('Price', courseForm.get('Price')?.value.toString());
    formData.append('IsPublic', courseForm.get('IsPublic')?.value.toString());
    formData.append('CoverImage', file);

    return this.resultService.postResult<number>(this.CourseUrl, formData);
  }

  //更新課程
  putCourse(
    courseForm: FormGroup,
    courseID: number,
    clientRequestId: string
  ): Observable<RePutDTO> {
    const file = courseForm.get('CoverImage')?.value;
    const formData = new FormData();
    if (file != null) {
      if (!(file instanceof File)) {
        console.error('❌ 圖片不是合法的檔案');
        return throwError(() => new Error('❌ 封面上傳欄位不是合法的檔案類型'));
      }
      // 圖片格式驗證（僅允許 jpg 和 png）
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        console.error('❌ 圖片格式錯誤，只允許 jpg 或 png');
        return throwError(
          () => new Error('❌ 圖片格式錯誤，僅支援 .jpg 與 .png')
        );
      }
      formData.append('CoverImage', file);
    }
    formData.append('clientRequestId', clientRequestId);
    formData.append('ConnectionId', this.connectionId);
    formData.append('CourseTitle', courseForm.get('CourseTitle')?.value);
    formData.append('CourseDes', courseForm.get('CourseDes')?.value);
    formData.append('Price', courseForm.get('Price')?.value.toString());
    formData.append('IsPublic', courseForm.get('IsPublic')?.value.toString());

    return this.resultService
      .putResult<ResCourseDTO>(`${this.CourseUrl}/${courseID}`, formData)
      .pipe(
        map((res) => ({
          success: res.statusCode === 200,
          message: res.message,
          statusCode: res.statusCode,
          errors: res.errors ?? [],
        })),
        catchError((err) => {
          return of({
            success: false,
            message: err.message || '更新失敗',
            statusCode: err.statusCode || 500,
            errors: [],
          } as RePutDTO);
        })
      );
  }
  //獲取章節
  getChapter(ID: number): Observable<ResChapterDTO> {
    return this.resultService.getResult<ResChapterDTO>(
      `${this.ChapterUrl}/${ID}`
    );
  }
  //新增章節
  postChapter(
    chapterForm: FormGroup<chapterDTO>,
    courseID: number,
    clientRequestId: string
  ): Observable<number> {
    const transChapterForm: ReqChapterDTO = {
      CourseId: courseID,
      ChapterTitle: chapterForm.get('ChapterTitle')?.value,
      ChapterDes: chapterForm.get('ChapterDes')?.value,
      ConnectionId: this.connectionId,
      clientRequestId: clientRequestId,
    };
    return this.resultService.postResult<number>(
      this.ChapterUrl,
      transChapterForm
    );
  }
  // 更新章節
  putChapter(
    chapterForm: FormGroup<chapterDTO>,
    chapterID: number,
    clientRequestId: string
  ): Observable<RePutDTO> {
    const transChapterForm = {
      ChapterTitle: chapterForm.get('ChapterTitle')?.value,
      ChapterDes: chapterForm.get('ChapterDes')?.value,
      ConnectionId: this.connectionId,
      clientRequestId: clientRequestId,
    };
    return this.resultService
      .putResult<RePutDTO>(`${this.ChapterUrl}/${chapterID}`, transChapterForm)
      .pipe(
        map((res) => ({
          success: res.statusCode === 200,
          message: res.message,
          statusCode: res.statusCode,
          errors: res.errors ?? [],
        })),
        catchError((err) => {
          return of({
            success: false,
            message: err.message || '更新失敗',
            statusCode: err.statusCode || 500,
            errors: [],
          } as RePutDTO);
        })
      );
  }
  //刪除章節
  delChapter(ID: number): Observable<RePutDTO> {
    return this.resultService.delResult(`${this.ChapterUrl}/${ID}`).pipe(
      map((res) => ({
        success: res.success && res.statusCode === 200,
        message: res.message,
        statusCode: res.statusCode,
        errors: res.errors ?? [],
      })),
      catchError((err) => {
        return of({
          success: false,
          message: err.message || '刪除失敗',
          statusCode: err.statusCode || 500,
          errors: [],
        } as RePutDTO);
      })
    );
  }
  //獲取影片
  getVideo(ID: number): Observable<ResVideoDTO> {
    return this.resultService.getResult<ResVideoDTO>(`${this.VideoUrl}/${ID}`);
  }
  //新增影片
  postVideo(
    videoForm: FormGroup<videoDTO>,
    chapterID: number,
    clientRequestId: string
  ): Observable<number> {
    const file = videoForm.get('VideoFile')?.value;
    if (file == null) {
      return throwError(() => new Error('沒有上傳檔案'));
    }
    if (!(file instanceof File)) {
      console.error('❌ 影片不是合法的檔案');
      return throwError(() => new Error('❌ 影片上傳欄位不是合法的檔案類型'));
    }
    // 影片格式驗證（僅允許 mp4）
    const validTypes = ['video/mp4'];
    if (!validTypes.includes(file.type)) {
      console.error('❌ 影片格式錯誤，只允許 mp4');
      return throwError(() => new Error('❌ 影片格式錯誤，僅支援 mp4'));
    }
    const formData = new FormData();
    formData.append('clientRequestId', clientRequestId);
    formData.append('ConnectionId', this.connectionId);
    formData.append('ChapterId', chapterID.toString());
    formData.append('Title', videoForm.get('Title')?.value);
    formData.append('VideoFile', file);
    return this.resultService.postResult<number>(this.VideoUrl, formData);
  }
  //更新影片
  putVideo(
    videoForm: FormGroup<videoDTO>,
    videoID: number,
    clientRequestId: string
  ): Observable<RePutDTO> {
    const file = videoForm.get('VideoFile')?.value;
    const formData = new FormData();
    if (file !== null) {
      if (!(file instanceof File)) {
        console.error('❌ 影片不是合法的檔案');
        return throwError(() => new Error('❌ 影片上傳欄位不是合法的檔案類型'));
      }
      const validTypes = ['video/mp4'];
      if (!validTypes.includes(file.type)) {
        console.error('❌ 影片格式錯誤，只允許 mp4');
        return throwError(() => new Error('❌ 影片格式錯誤，僅支援 mp4'));
      }
      formData.append('VideoFile', file);
    }
    formData.append('clientRequestId', clientRequestId);
    formData.append('ConnectionId', this.connectionId);
    formData.append('Title', videoForm.get('Title')?.value);
    return this.resultService
      .putResult<ResVideoDTO>(`${this.VideoUrl}/${videoID}`, formData)
      .pipe(
        map((res) => ({
          success: res.statusCode === 200,
          message: res.message,
          statusCode: res.statusCode,
          errors: res.errors ?? [],
        })),
        catchError((err) => {
          return of({
            success: false,
            message: err.message || '更新影片失敗',
            statusCode: err.statusCode || 500,
            errors: [],
          } as RePutDTO);
        })
      );
  }
  //刪除影片
  delVideo(ID: number): Observable<RePutDTO> {
    return this.resultService.delResult(`${this.VideoUrl}/${ID}`).pipe(
      map((res) => ({
        success: res.success && res.statusCode === 200,
        message: res.message,
        statusCode: res.statusCode,
        errors: res.errors ?? [],
      })),
      catchError((err) => {
        return of({
          success: false,
          message: err.message || '刪除失敗',
          statusCode: err.statusCode || 500,
          errors: [],
        } as RePutDTO);
      })
    );
  }
  //最終
  //告訴後端確認建立課程
  putCourseFinal(courseID: number, IsDraft: boolean): Observable<RePutDTO> {
    const req: ReqFinalDTO = {
      IsDraft: IsDraft,
      ConnectionId: this.connectionId,
    };
    return this.resultService.putResult<RePutDTO>(
      `${this.CourseFinal}/${courseID}`,
      req
    );
  }
  //取的所有課程資訊
  getCourseAllDetails(courseId: number): Observable<ResCourseAllDetailsDTO> {
    return this.resultService.getResult<ResCourseAllDetailsDTO>(
      `${this.CourseAllDetails}/${courseId}`
    )
  }
  //建立課程權限
  postCourseAccess(courseAccess: FormControl, courseId: number): Observable<boolean> {
    const req: ReqCourseAccessDTO = {
      courseId: courseId,
      depIds: courseAccess.value
    };
    return this.resultService.postResult(this.CourseAccessUrl, req);
  }
  //建立課程標籤HashTag
  postCourseHashTag(courseHashTag: FormControl, courseId: number): Observable<boolean> {
    const req: ReqCourseHashTagDTO = {
      courseId: courseId,
      hashTagIds: courseHashTag.value,
    };
    return this.resultService.postResult(this.CourseHashTagUrl, req);
  }
  //獲取部門清單
  getDepList(): Observable<ResDepDTO[]> {
    return this.resultService.getResult<ResDepDTO[]>(this.DepListUrl);
  }
  //獲取HashTag清單
  getHashTagList(): Observable<ResHashTagDTO[]> {
    return this.resultService.getResult<ResHashTagDTO[]>(this.HashTagListUrl);
  }
  disconnect(): void {
    if (this.hubConnection) {
      this.hubConnection
        .stop()
        .then(() => {
          console.log('❎ 已中斷 SignalR 連線');
        })
        .catch((err) => {
          console.error('❌ SignalR 中斷連線失敗', err);
        });
    }
  }
}
