import { JWTService } from './../../Share/JWT/jwt.service';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ResultService } from 'src/app/Share/result.service';

import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ResCourseDTO, ReqChapterDTO, ResChapterDTO, ResVideoDTO, RePutDTO, chapterDTO, videoDTO } from 'src/app/Interface/createCourseDTO';
@Injectable({
  providedIn: 'root',
})
export class CourseSignalrService {

  private hubConnection?: signalR.HubConnection;

  constructor(private resultService: ResultService) { }
  CourseUrl = 'https://localhost:7073/api/course'
  ChapterUrl = "https://localhost:7073/api/chapter"
  VideoUrl = "https://localhost:7073/api/video"
  // 在 Service 裡加上：
  private progressSubject = new BehaviorSubject<{ step: string; data: any } | null>(null);
  progress$ = this.progressSubject.asObservable();

  connect(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7073/courseHub') // 攔截器自動加 token
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('✅ SignalR 已連線'))
      .catch(err => console.error('❌ SignalR 連線失敗', err));

    this.hubConnection.on('ReceiveCourseStepUpdate', (step: string, data: any) => {
      console.log('📩 收到推播', step, data);
      this.progressSubject.next({ step, data });
    });
  }
  //獲取課程
  getCourse(ID: number): Observable<ResCourseDTO> {
    return this.resultService.getResult<ResCourseDTO>(
      `${this.CourseUrl}/${ID}`
    );
  }

  //新增課程
  postCourse(courseForm: FormGroup): Observable<number> {
    const file = courseForm.get('CoverImage')?.value;
    if (file == null) {
      return throwError(() => new Error('沒有上傳檔案'));
    }
    if (!(file instanceof File)) {
      console.error("❌ 圖片不是合法的檔案");
      return throwError(() => new Error('❌ 封面上傳欄位不是合法的檔案類型'));
    }
    // 圖片格式驗證（僅允許 jpg 和 png）
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      console.error("❌ 圖片格式錯誤，只允許 jpg 或 png");
      return throwError(() => new Error('❌ 圖片格式錯誤，僅支援 .jpg 與 .png'));
    }

    const formData = new FormData();
    formData.append('CompanyId', courseForm.get('CompanyId')?.value.toString());
    formData.append('CourseTitle', courseForm.get('CourseTitle')?.value);
    formData.append('CourseDes', courseForm.get('CourseDes')?.value);
    formData.append('Price', courseForm.get('Price')?.value.toString());
    formData.append('IsPublic', courseForm.get('IsPublic')?.value.toString());
    formData.append('CoverImage', file);


    return this.resultService.postResult<number>(
      this.CourseUrl,
      formData
    );
  }
  //更新課程
  putCourse(courseForm: FormGroup, courseID: number): Observable<RePutDTO> {
    const file = courseForm.get('CoverImage')?.value;
    const formData = new FormData();
    if (file != null) {
      if (!(file instanceof File)) {
        console.error("❌ 圖片不是合法的檔案");
        return throwError(() => new Error('❌ 封面上傳欄位不是合法的檔案類型'));
      }
      // 圖片格式驗證（僅允許 jpg 和 png）
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        console.error("❌ 圖片格式錯誤，只允許 jpg 或 png");
        return throwError(() => new Error('❌ 圖片格式錯誤，僅支援 .jpg 與 .png'));
      }
      formData.append('CoverImage', file);
    }
    formData.append('CompanyId', courseForm.get('CompanyId')?.value.toString());
    formData.append('CourseTitle', courseForm.get('CourseTitle')?.value);
    formData.append('CourseDes', courseForm.get('CourseDes')?.value);
    formData.append('Price', courseForm.get('Price')?.value.toString());
    formData.append('IsPublic', courseForm.get('IsPublic')?.value.toString());

    return this.resultService.putResult<ResCourseDTO>(`${this.CourseUrl}/${courseID}`, formData).pipe(
      map(res => ({
        success: res.statusCode === 200,
        message: res.message,
        statusCode: res.statusCode,
        errors: res.errors ?? []
      })),
      catchError(err => {
        return of({
          success: false,
          message: err.message || '更新失敗',
          statusCode: err.statusCode || 500,
          errors: []
        } as RePutDTO);
      })
    );
  }
  //獲取章節
  getChapter(ID: number): Observable<ResChapterDTO> {
    return this.resultService.getResult<ResChapterDTO>(
      `${this.ChapterUrl}/${ID}`
    )
  }
  //新增章節
  postChapter(chapterForm: FormGroup<chapterDTO>, courseID: number): Observable<number> {
    const transChapterForm: ReqChapterDTO = {
      CourseId: courseID,
      ChapterTitle: chapterForm.get("ChapterTitle")?.value,
      ChapterDes: chapterForm.get("ChapterDes")?.value,
    }
    return this.resultService.postResult<number>(
      this.ChapterUrl,
      transChapterForm
    );
  }
  // 更新章節
  putChapter(chapterForm: FormGroup<chapterDTO>, chapterID: number): Observable<RePutDTO> {
    return this.resultService.putResult<ResChapterDTO>(
      `${this.ChapterUrl}/${chapterID}`,
      chapterForm.value
    ).pipe(
      map(res => ({
        success: res.statusCode === 200,
        message: res.message,
        statusCode: res.statusCode,
        errors: res.errors ?? []
      })),
      catchError(err => {
        return of({
          success: false,
          message: err.message || '更新失敗',
          statusCode: err.statusCode || 500,
          errors: []
        } as RePutDTO);
      })
    );
  }
  //刪除章節
  delChapter(ID: number): Observable<RePutDTO> {
    return this.resultService.delResult(
      `${this.ChapterUrl}/${ID}`
    ).pipe(
      map(res => ({
        success: res.success && res.statusCode === 200,
        message: res.message,
        statusCode: res.statusCode,
        errors: res.errors ?? []
      })),
      catchError(err => {
        return of({
          success: false,
          message: err.message || '刪除失敗',
          statusCode: err.statusCode || 500,
          errors: []
        } as RePutDTO);
      })
    );
  }
  //獲取影片
  getVideo(ID: number): Observable<ResVideoDTO> {
    return this.resultService.getResult(
      `${this.VideoUrl}/${ID}`
    )
  }
  //新增影片
  postVideo(videoForm: FormGroup<videoDTO>, chapterID: number): Observable<number> {
    const file = videoForm.get('VideoFile')?.value;
    if (file == null) {
      return throwError(() => new Error('沒有上傳檔案'));
    }
    if (!(file instanceof File)) {
      console.error("❌ 影片不是合法的檔案");
      return throwError(() => new Error('❌ 影片上傳欄位不是合法的檔案類型'));
    }
    // 影片格式驗證（僅允許 mp4）
    const validTypes = ['video/mp4'];
    if (!validTypes.includes(file.type)) {
      console.error("❌ 影片格式錯誤，只允許 mp4");
      return throwError(() => new Error('❌ 影片格式錯誤，僅支援 mp4'));
    }
    const formData = new FormData();
    formData.append('ChapterId', chapterID.toString());
    formData.append('Title', videoForm.get('Title')?.value);
    formData.append('VideoFile', file);
    return this.resultService.postResult<number>(
      this.VideoUrl,
      formData
    )
  }
  //更新影片
  putVideo(videoForm: FormGroup<videoDTO>, videoID: number): Observable<RePutDTO> {
    const file = videoForm.get('VideoFile')?.value;
    const formData = new FormData();
    if (file !== null) {
      if (!(file instanceof File)) {
        console.error("❌ 影片不是合法的檔案");
        return throwError(() => new Error('❌ 影片上傳欄位不是合法的檔案類型'));
      }
      const validTypes = ['video/mp4'];
      if (!validTypes.includes(file.type)) {
        console.error("❌ 影片格式錯誤，只允許 mp4");
        return throwError(() => new Error('❌ 影片格式錯誤，僅支援 mp4'));
      }
      formData.append('VideoFile', file);
    }
    formData.append('Title', videoForm.get('Title')?.value);
    return this.resultService.putResult(
      `${this.VideoUrl}/${videoID}`,
      formData
    )
  }
  //刪除影片
  delVideo(ID: number): Observable<RePutDTO> {
    return this.resultService.delResult(
      `${this.VideoUrl}/${ID}`
    ).pipe(
      map(res => ({
        success: res.success && res.statusCode === 200,
        message: res.message,
        statusCode: res.statusCode,
        errors: res.errors ?? []
      })),
      catchError(err => {
        return of({
          success: false,
          message: err.message || '刪除失敗',
          statusCode: err.statusCode || 500,
          errors: []
        } as RePutDTO);
      })
    );
  }
  disconnect(): void {
    this.hubConnection?.stop().then(() => {
      console.log('❎ 已中斷 SignalR 連線');
    });
  }
}
