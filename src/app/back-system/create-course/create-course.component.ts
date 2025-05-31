import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class CreateCourseComponent implements OnInit {
  steps = [{ label: '建立課程' }, { label: '新增章節' }];
  currentStep = 0;

  courseDetailForm!: FormGroup;
  chapterForm!: FormGroup;
  videoForm!: FormGroup;

  coverPreviewUrl: string | null = null;
  selectedVideoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initCourseForm();
    this.initChapterForm();
    this.initVideoForm();
  }

  private initCourseForm() {
    this.courseDetailForm = this.fb.group({
      courseTitle: ['', Validators.required],
      courseDes: [''],
      isPublic: ['true'],
      coursePrice: [0, [Validators.required, Validators.min(0)]],
      cover: [null],
      chapters: this.fb.array([])
    });
  }

  private initChapterForm() {
    this.chapterForm = this.fb.group({
      chapterTitle: ['', Validators.required],
      chapterDes: ['']
    });
  }

  private initVideoForm() {
    this.videoForm = this.fb.group({
      title: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  get chapters(): FormArray {
    return this.courseDetailForm.get('chapters') as FormArray;
  }

  onCoverSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.coverPreviewUrl = reader.result as string;
    reader.readAsDataURL(file);

    this.courseDetailForm.patchValue({ cover: file });
  }

  onVideoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedVideoFile = file;
    this.videoForm.patchValue({ file });
  }

  onNext() {
    const stepLabel = this.steps[this.currentStep].label;

    switch (stepLabel) {
      case '建立課程':
        this.handleCourseStep();
        break;

      case '新增章節':
        this.handleChapterStep();
        break;

      case '新增影片':
        this.handleVideoStep();
        break;
    }
  }

  onPrev() {
    if (this.currentStep > 0) {
      this.steps.pop();
      this.currentStep--;
    }
  }

  private handleCourseStep() {
    if (this.courseDetailForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: '資料不完整', detail: '請填寫課程標題和價格' });
      return;
    }
    this.currentStep++;
  }

  private handleChapterStep() {
    if (this.chapterForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: '章節未填寫完整', detail: '請輸入章節標題' });
      return;
    }

    // 章節加入章節列表
    this.appendChapter();

    this.confirmationService.confirm({
      message: '是否為此章節新增影片？',
      header: '新增影片',
      icon: 'pi pi-video',
      acceptLabel: '是',
      rejectLabel: '否',
      accept: () => {
        this.steps.push({ label: '新增影片' });
        this.currentStep++;
        this.initVideoForm();
      },
      reject: () => {
        // ⭐⭐ 修正：使用 setTimeout 避免 UI 渲染跳過 confirm
        setTimeout(() => this.confirmAddChapterOnly(), 200);
      }
    });
  }



  private handleVideoStep() {
    if (this.videoForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: '影片未填寫完整', detail: '請輸入影片標題並上傳影片' });
      return;
    }

    this.appendVideoToPreviousChapter();

    this.confirmationService.confirm({
      message: '是否為此課程新增下一章節？',
      header: '新增章節',
      icon: 'pi pi-folder-open',
      acceptLabel: '是',
      rejectLabel: '否',
      accept: () => {
        this.steps.push({ label: '新增章節' });
        this.currentStep++;
        this.initChapterForm();
      },
      reject: () => {
        this.finalizeCourse();
      }
    });
  }


  private confirmAddChapterOnly() {
    this.confirmationService.confirm({
      message: '是否為此課程新增下一章節？',
      header: '新增章節',
      icon: 'pi pi-folder-open',
      acceptLabel: '是',
      rejectLabel: '否',
      accept: () => {
        this.steps.push({ label: '新增章節' });
        this.currentStep++;
        this.initChapterForm();
      },
      reject: () => {
        this.finalizeCourse();
      }
    });
  }

  private appendChapter() {
    this.chapters.push(this.fb.group({
      chapterTitle: this.chapterForm.value.chapterTitle,
      chapterDes: this.chapterForm.value.chapterDes,
      videos: this.fb.array([])
    }));
  }

  private appendVideoToPreviousChapter() {
    const lastChapterGroup = this.chapters.at(this.chapters.length - 1) as FormGroup;
    const videoArray = lastChapterGroup.get('videos') as FormArray;
    videoArray.push(this.fb.group({
      title: this.videoForm.value.title,
      file: this.videoForm.value.file
    }));
  }

  private finalizeCourse() {
    console.log('最終課程資料:', this.courseDetailForm.value);
    this.messageService.add({ severity: 'success', summary: '課程建立完成', detail: '課程已成功建立' });
    // TODO: 可在這裡進行實際的 API 呼叫送出
  }
}
