import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  isFinalStep: boolean = false;
  @ViewChild('videofile') videofile!: ElementRef<HTMLInputElement>;


  coverPreviewUrl: string | null = null;
  selectedVideoFile: File | null = null;
  selectedVideoFileName: string | null = null;
  lastUnsavedChapter: any = null;
  lastUnsavedVideo: any = null;

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
  getHasFinal() {
    if (this.steps[this.steps.length - 1].label.includes("確認建立課程")) {
      return true
    } else {
      return false
    }
  }
  onNext() {
    const stepLabel = this.steps[this.currentStep].label;
    this.selectedVideoFileName = '';

    // 若不是最後一個步驟，直接切換步驟
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      console.log((this.steps.length - 1));
      console.log(this.currentStep);
      return;
    }

    switch (stepLabel) {
      case '建立課程':
        this.handleCourseStep();
        break;

      case '新增章節':
        if (this.lastUnsavedChapter && this.currentStep === this.steps.length - 1) {
          this.chapterForm.patchValue(this.lastUnsavedChapter);
          this.lastUnsavedChapter = null;
        } else {
          this.handleChapterStep();
        }
        break;

      case '新增影片':
        console.log(this.lastUnsavedVideo);
        if (this.lastUnsavedVideo && this.currentStep === this.steps.length - 1) {
          const { title, file } = this.lastUnsavedVideo;
          this.videoForm.patchValue({ title, file });
          this.selectedVideoFile = file ?? null;
          this.selectedVideoFileName = file?.name ?? '';
          this.lastUnsavedVideo = null;
        } else {
          this.handleVideoStep();
        }
        break;
    }
  }


  onPrev() {
    if (this.currentStep <= 0) return;

    const currentLabel = this.steps[this.currentStep].label;

    // ✅ 暫存當前未提交的資料
    if (currentLabel === '新增章節' && this.chapterForm.dirty) {
      this.lastUnsavedChapter = this.chapterForm.getRawValue();
    } else if (currentLabel === '新增影片' && this.videoForm.dirty) {
      this.lastUnsavedVideo = {
        ...this.videoForm.getRawValue(),
        file: this.selectedVideoFile
      };
      this.videofile.nativeElement.value = ''; // 清除舊檔名
    }

    // 🔄 回到上一步
    this.currentStep--;

    const prevStepLabel = this.steps[this.currentStep].label;

    // 統計前面的章節與影片數量
    const chapterStepCount = this.steps.slice(0, this.currentStep + 1)
      .filter(s => s.label === '新增章節').length;
    const videoStepCount = this.steps.slice(0, this.currentStep + 1)
      .filter(s => s.label === '新增影片').length;

    // ✅ 回填「已儲存的章節資料」
    if (prevStepLabel === '新增章節') {
      const chapter = this.chapters.at(chapterStepCount - 1);
      if (chapter) {
        this.chapterForm.patchValue({
          chapterTitle: chapter.get('chapterTitle')?.value,
          chapterDes: chapter.get('chapterDes')?.value
        });
      }
    }

    // ✅ 回填「已儲存的影片資料」
    else if (prevStepLabel === '新增影片') {
      let videoCounter = 0;
      for (let c = 0; c < this.chapters.length; c++) {
        const chapterGroup = this.chapters.at(c) as FormGroup;
        const videoArray = chapterGroup.get('videos') as FormArray;
        for (let v = 0; v < videoArray.length; v++) {
          videoCounter++;
          if (videoCounter === videoStepCount) {
            const video = videoArray.at(v);
            const file = video.get('file')?.value;
            this.videoForm.patchValue({
              title: video.get('title')?.value,
              file
            });
            this.selectedVideoFile = file ?? null;
            this.selectedVideoFileName = file?.name ?? '';
            return;
          }
        }
      }
    }
  }




  removeLastStep() {
    this.confirmationService.confirm({
      message: '確定要移除這個步驟嗎？',
      header: '移除步驟',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: '是',
      rejectLabel: '否',
      accept: () => {
        const lastSecStep = this.steps[this.steps.length - 2]?.label;
        if (lastSecStep === '新增章節') {
          const lastChapter = this.chapters.at(this.chapters.length - 1);
          // ✅ 儲存資料用於回填
          const chapterTitle = lastChapter.get('chapterTitle')?.value;
          const chapterDes = lastChapter.get('chapterDes')?.value;
          // ✅ 回填至章節表單
          this.chapterForm.patchValue({
            chapterTitle,
            chapterDes
          });
          this.chapters.removeAt(this.chapters.length - 1);
        } else if (lastSecStep === '新增影片') {
          const lastChapterGroup = this.chapters.at(this.chapters.length - 1) as FormGroup;
          const videoArray = lastChapterGroup.get('videos') as FormArray;

          if (videoArray.length > 0) {
            const lastVideo = videoArray.at(videoArray.length - 1);
            // ✅ 儲存資料用於回填
            const videoTitle = lastVideo.get('title')?.value;
            const videoFile = lastVideo.get('file')?.value;
            // ✅ 回填至影片表單
            this.videoForm.patchValue({
              title: videoTitle,
              file: videoFile
            });
            this.selectedVideoFileName = videoFile?.name ?? null; // 加上這
            // ✅ 若要讓檔案預覽正確顯示，還需要更新 file input
            if (this.videofile && this.videofile.nativeElement) {
              this.videofile.nativeElement.value = ''; // 清除舊檔名
            }
            this.selectedVideoFile = videoFile ?? null;// 預覽邏輯可配合這個狀態處理
            videoArray.removeAt(videoArray.length - 1);
          }
        }
        this.steps.splice(this.steps.length - 1, 1); // 移除倒數第1個（確認建立課程前）
        this.currentStep--;
      }
    });

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

    this.confirmationService.confirm({
      message: '是否為此章節新增影片？',
      header: '新增影片',
      icon: 'pi pi-video',
      acceptLabel: '是',
      rejectLabel: '否',
      accept: () => {
        // 章節加入章節列表
        this.appendChapter();
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
    this.confirmationService.confirm({
      message: '是否繼續為此章節新增影片？',
      header: '繼續新增影片',
      icon: 'pi pi-video',
      acceptLabel: '是',
      rejectLabel: '否',
      accept: () => {
        this.appendVideoToPreviousChapter();
        this.videofile.nativeElement.value = ''; // ✅ 重設 UI 上殘留的檔案名稱
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


  private confirmAddChapterOnly() {
    this.confirmationService.confirm({
      message: '是否為此課程新增下一章節？',
      header: '新增章節',
      icon: 'pi pi-folder-open',
      acceptLabel: '是',
      rejectLabel: '否',
      accept: () => {
        if (this.steps[this.steps.length - 1].label === "新增影片") {
          this.appendVideoToPreviousChapter();
        } else {
          this.appendChapter()
        }
        this.steps.push({ label: '新增章節' });
        this.currentStep++;
        this.initChapterForm();
      },
      reject: () => {
        if (this.steps[this.steps.length - 1].label === "新增影片") {
          this.appendVideoToPreviousChapter();
        } else {
          this.appendChapter()
        }
        this.steps.splice(this.currentStep + 1, 0, { label: '確認建立課程' });
        this.currentStep++;
        this.isFinalStep = true;

        this.messageService.add({
          severity: 'info',
          summary: '流程完成',
          detail: '課程章節與影片設定完成，請確認課程內容',
        });
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

  finalizeCourse() {
    console.log('最終課程資料:', this.courseDetailForm.value);
    this.messageService.add({ severity: 'success', summary: '課程建立完成', detail: '課程已成功建立' });
    // TODO: 可在這裡進行實際的 API 呼叫送出
  }
}
