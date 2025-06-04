import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
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


  ngOnInit() {
    this.signalR.connect();
  }
  courseForm = new FormGroup({
    CompanyId: new FormControl(1),
    CourseTitle: new FormControl("6666"),
    CourseDes: new FormControl("777"),
    IsPublic: new FormControl(true),
    CoverImage: new FormControl(null), // 這裡先不給字串，會用 <input type="file"> 補上 File
    Price: new FormControl(9999),
  });

  onPrev() {

  }
  onNext() {
    this.signalR.postCourse(this.courseForm).subscribe({
      next: courseId => {
        // 開始監聽 SignalR 回傳進度
        // 開始監聽 SignalR 回傳進度
        this.signalR.onCourseUploadProgress(courseId).subscribe(progress => {
          this.uploadProgress = progress;

          if (progress >= 100) {
            this.isSubmitting = false;
            this.messageService.add({ severity: 'success', summary: '上傳完成' });
            this.unlockNextStep(); // ✅ 解鎖下一步
          }
        });
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: '建立課程失敗',
          detail: err.message
        });
        console.error('❌ 建立失敗原因：', err.message);
      }
    });
    this.signalR.progress$.subscribe(update => {
      if (update) {
        this.progressPercent = update.data.percent; // 假設 data 有 percent
        if (update.step === 'CourseCreated') {
          this.unlockNextButton();
        }
      }
    });

  }
}
