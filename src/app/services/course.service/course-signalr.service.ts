import { JWTService } from './../../Share/JWT/jwt.service';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ResultService } from 'src/app/Share/result.service';

import { BehaviorSubject, Observable, of, tap, throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CourseSignalrService {

  private hubConnection?: signalR.HubConnection;

  constructor(private resultService: ResultService, private JWTService: JWTService, private http: HttpClient) { }
  postCourseUrl = 'https://localhost:7073/api/course'
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

  postCourse(courseForm: FormGroup): Observable<number> {
    const file = courseForm.get('CoverImage')?.value;
    if (!(file instanceof File)) {
      console.error("❌ 圖片不是合法的檔案");
      return throwError(() => new Error('❌ CoverImage 欄位不是合法的檔案類型'));
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
    //之後要砍
    const token = this.JWTService.getToken(); // ⬅️ 這裡自己帶 token，可從 localStorage 或變數取

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.post<number>(
      this.postCourseUrl,
      formData,
      { headers }
    ).subscribe({
      next: (res) => {
        console.log("✅ 手動呼叫成功：", res);
      },
      error: (err) => {
        console.error("❌ 呼叫失敗：", err);
      }
    });

    return this.resultService.postResult<number>(
      this.postCourseUrl,
      formData
    );
  }
  disconnect(): void {
    this.hubConnection?.stop().then(() => {
      console.log('❎ 已中斷 SignalR 連線');
    });
  }
}
