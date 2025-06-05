import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CourseSignalrService } from 'src/app/services/course.service/course-signalr.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class CreateCourseComponent {
  constructor(private signalR: CourseSignalrService,
    private messageService: MessageService
  ) { }
  steps: MenuItem[] = [
    {
      label: "建立課程",
      id: "0"//SQL courseID
    },
    {
      label: "新增章節",
      id: "0"//SQL chapterID
    }
  ]
  currentStep = 0 //控制步驟
  coverPreviewUrl: string = 'assets/img/noimage.png'
  ngOnInit() {
    this.signalR.connect();
    // 開始監聽 SignalR 回傳進度
    this.signalR.progress$.subscribe(update => {
      if (update && update.step === 'CourseCreated') {
        this.progressPercent = update.data.percent;
        if (update.data.percent === 100) {
          this.unlockNextButton();
        }
      }
    });
  }

  courseForm = new FormGroup({
    CompanyId: new FormControl(1),
    CourseTitle: new FormControl("6666"),
    CourseDes: new FormControl("777"),
    IsPublic: new FormControl("true"),
    CoverImage: new FormControl(), // 這裡先不給字串，會用 <input type="file"> 補上 File
    Price: new FormControl(9999),
  });
  onCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.courseForm.get('CoverImage')?.setValue(file);
      const reader = new FileReader()
      reader.onload = () => this.coverPreviewUrl = reader.result as string
      reader.readAsDataURL(file)
    }
  }
  //上一步
  onPrev() {

  }
  //下一步
  isNextButton = true //控制按鈕是否解鎖
  progressPercent = 0//顯示上傳進度
  isUploading = false;//顯示 loading bar 或是停用按鈕
  unlockNextButton() {
    this.isNextButton = !this.isNextButton
  }
  onNext() {
    this.isUploading = !this.isUploading;
    this.signalR.postCourse(this.courseForm).subscribe({
      next: res => {
        // loading 狀態中，等待 SignalR 回傳
        console.log(res);
      },
      error: err => {
        this.isUploading = !this.isUploading;
        this.messageService.add({
          severity: 'error',
          summary: '建立課程失敗',
          detail: err.message
        });
        console.error('❌ 建立失敗原因：', err.message);
      }
    });
  }
  //取消訂閱或中斷 SignalR 連線
  ngOnDestroy() {
    this.signalR.disconnect();
  }
}
