import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class CreateCourseComponent implements OnInit {
  steps: MenuItem[] = [];
  currentStep: number = 0;

  courseDetailForm!: FormGroup;
  chapterForm!: FormGroup;
  videoForm!: FormGroup;

  showAddVideoDialog: boolean = false;
  showNextButton: boolean = true;
  showConfirmButton: boolean = false;

  publicOptions = [
    { label: '公開', value: true },
    { label: '不公開', value: false },
  ];

  chapters: any[] = [];
  uploadedCover: File | null = null;
  uploadedVideo: File | null = null;

  constructor(
    private fb: FormBuilder,
    private confirmService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // 預設三個步驟，章節影片也存在（可依需要隱藏）
    this.steps = [{ label: '課程細節' }, { label: '章節內容' }];

    this.initForms();
  }

  initForms(): void {
    this.courseDetailForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      isPublic: [null, Validators.required],
      price: [null, Validators.required], // 改 null 方便驗證
      cover: [null, Validators.required],
    });

    this.chapterForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });

    this.videoForm = this.fb.group({
      video: [null, Validators.required],
    });
  }

  goNext(): void {
    if (this.currentStep === 0) {
      console.log('有進 currentStep === 0');

      // 強制觸發驗證狀態
      this.courseDetailForm.markAllAsTouched();
      this.courseDetailForm.updateValueAndValidity();

      const cover = this.courseDetailForm.get('cover')?.value;
      console.log('封面值：', cover);

      if (!cover) {
        this.messageService.add({
          severity: 'error',
          summary: '驗證失敗',
          detail: '請上傳課程封面',
        });
        return;
      }

      if (this.courseDetailForm.valid) {
        console.log('有進 goNext');
        this.currentStep++;
        console.log('currentStep:', this.currentStep);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: '驗證失敗',
          detail: '請填寫課程細節所有必填欄位',
        });
      }
    } else if (this.currentStep === 1) {
      if (this.chapterForm.valid) {
        this.confirmService.confirm({
          message: '是否為此章節新增影片？',
          accept: () => {
            this.currentStep++;
            this.showNextButton = true;
            this.showConfirmButton = false;
          },
          reject: () => {
            this.chapters.push(this.chapterForm.value);
            this.chapterForm.reset();
            this.messageService.add({
              severity: 'info',
              summary: '章節已新增',
            });
            this.confirmService.confirm({
              message: '是否繼續新增另一個章節？',
              accept: () => {
                this.showNextButton = true;
                this.showConfirmButton = false;
              },
              reject: () => {
                this.showNextButton = false;
                this.showConfirmButton = true;
                this.currentStep = 1;
              },
            });
          },
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: '驗證失敗',
          detail: '請填寫章節內容所有必填欄位',
        });
      }
    } else if (this.currentStep === 2) {
      if (this.videoForm.valid) {
        this.chapters.push({
          ...this.chapterForm.value,
          video: this.uploadedVideo,
        });

        this.confirmService.confirm({
          message: '是否新增另一個章節？',
          accept: () => {
            this.chapterForm.reset();
            this.videoForm.reset();
            this.uploadedVideo = null;
            this.currentStep = 1;
            this.showNextButton = true;
            this.showConfirmButton = false;
          },
          reject: () => {
            this.showNextButton = false;
            this.showConfirmButton = true;
          },
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: '驗證失敗',
          detail: '請上傳章節影片',
        });
      }
    }
  }

  goBack(): void {
    if (this.currentStep === 0) return;

    if (this.currentStep === 2) {
      this.confirmService.confirm({
        message: '返回將會清除目前章節影片的內容，確定嗎？',
        accept: () => {
          this.videoForm.reset();
          this.uploadedVideo = null;
          this.currentStep = 1;
          this.showNextButton = true;
          this.showConfirmButton = false;
        },
      });
    } else {
      this.currentStep--;
      this.showNextButton = true;
      this.showConfirmButton = false;
    }
  }

  submitCourse(): void {
    if (this.chapters.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: '課程需至少一章節',
      });
      return;
    }

    const courseData = {
      ...this.courseDetailForm.value,
      cover: this.uploadedCover,
      chapters: this.chapters,
    };

    console.log('📝 Final Course Data:', courseData);
    this.messageService.add({ severity: 'success', summary: '課程建立成功' });

    // TODO: 呼叫 API 上傳資料
  }

  onCoverUpload(event: any): void {
    console.log('有傳檔案');
    const file = event.files[0];

    if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
      this.uploadedCover = file;
      this.courseDetailForm.get('cover')?.setValue(file);
      this.courseDetailForm.get('cover')?.updateValueAndValidity();

      this.messageService.add({
        severity: 'success',
        summary: '成功',
        detail: '封面已上傳',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: '格式錯誤',
        detail: '請上傳 JPG 或 PNG',
      });
    }
  }

  onVideoUpload(event: any): void {
    const file = event.files[0];
    if (file && file.type === 'video/mp4') {
      this.uploadedVideo = file;
      this.videoForm.get('video')?.setValue(file);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: '格式錯誤',
        detail: '只接受 MP4 影片',
      });
    }
  }

  confirmAddVideo(addVideo: boolean) {
    this.showAddVideoDialog = false;

    if (addVideo) {
      // 直接切到影片上傳步驟
      this.currentStep = 2;
      this.showNextButton = true;
      this.showConfirmButton = false;
    } else {
      this.confirmService.confirm({
        message: '是否新增另一個章節？',
        accept: () => {
          this.chapters.push(this.chapterForm.value);
          this.chapterForm.reset();
          this.currentStep = 1;
          this.showNextButton = true;
          this.showConfirmButton = false;
        },
        reject: () => {
          this.showNextButton = false;
          this.showConfirmButton = true;
        },
      });
    }
  }
}
