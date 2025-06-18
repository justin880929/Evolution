import { Router } from '@angular/router';
import { ConfigService } from './../../services/config.service';
import { Component, ElementRef, OnInit, ViewChild, Pipe } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CourseSignalrService } from 'src/app/services/course.service/course-signalr.service';
import { courseDTO, chapterDTO, videoDTO, RePutDTO, ResCourseAllDetailsDTO, ResDepDTO, ResHashTagDTO } from "../../Interface/createCourseDTO";
import { BehaviorSubject, Observable, Subscription, delay, firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class CreateCourseComponent {
  constructor(private signalR: CourseSignalrService,
    private messageService: MessageService,
    private configService: ConfirmationService,
    private router: Router
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
  //第一步驟課程表單是否第一次輸入
  isCourseFirst = true
  ngOnInit() {
    this.signalR.connect();

  }
  // 在 component 中改為：
  originalCoverImageUrl$ = new BehaviorSubject<string | null>(null);
  lockButton = false
  minLengthArray(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if ((control.value as number[]).length >= min) return null;
      return { required: true };
    };
  }
  CourseFinalGroup = new FormGroup({
    DepFormControl: new FormControl<number[]>([], [this.minLengthArray(1)]),
    HasTagFormControl: new FormControl<number[]>([], [this.minLengthArray(1)])
  });
  departmentOptions!: ResDepDTO[];
  hashtagOptions!: ResHashTagDTO[];
  //課程表單
  courseForm = new FormGroup<courseDTO>({
    CompanyId: new FormControl(1),
    CourseTitle: new FormControl({ value: '', disabled: this.lockButton }, Validators.required),
    CourseDes: new FormControl({ value: '', disabled: this.lockButton }, Validators.required),
    IsPublic: new FormControl({ value: 'true', disabled: this.lockButton }, Validators.required),
    CoverImage: new FormControl({ value: '', disabled: this.lockButton }, Validators.required), // 這裡先不給字串，會用 <input type="file"> 補上 File
    Price: new FormControl({ value: null, disabled: this.lockButton }, Validators.required),
  });
  //章節表單
  chapterForm = new FormGroup<chapterDTO>({
    ChapterTitle: new FormControl({ value: '', disabled: this.lockButton }, Validators.required),
    ChapterDes: new FormControl({ value: '', disabled: this.lockButton }, Validators.required)
  })
  //影片表單
  videoForm = new FormGroup<videoDTO>({
    Title: new FormControl({ value: '', disabled: this.lockButton }, Validators.required),
    VideoFile: new FormControl({ value: '', disabled: this.lockButton }, Validators.required)
  })
  //確認建立課程
  FinalCheck: ResCourseAllDetailsDTO = {
    courseTitle: "",
    courseDes: "",
    isPublic: false,
    price: 0,
    coverImagePath: '',
    chapterWithVideos: []
  }
  //初始化課程表單
  InitCourseForm() {
    this.courseForm.reset()
    this.originalCoverImageUrl$.next(null)
    this.courseForm.markAsPristine()
    this.courseForm.markAsUntouched()
  }
  //初始化章節表單
  InitChapterForm() {
    this.chapterForm.reset()
    this.chapterForm.markAsPristine()
    this.chapterForm.markAsUntouched()
  }
  //初始化影片表單
  InitVideoForm() {
    this.videoForm.reset()
    // 手動清除檔案 input 的值
    if (this.videoInputRef) {
      this.videoInputRef.nativeElement.value = '';
    }
    this.selectedVideoFileName = null
    this.videoForm.markAsPristine(); // 加上這行
    this.videoForm.markAsUntouched();

  }
  //自訂 Validator 檢查封面 File 或 字串都視為有效
  coverImageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value instanceof File) {
        return null; // 有上傳檔案
      }
      if (typeof value === 'string' && value.trim() !== '') {
        return null; // 有回填 URL
      }
      return { required: true }; // 沒上傳也沒回填
    };
  }
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
  //自訂 Validator 檢查影片 File 或 字串都視為有效
  @ViewChild('videoInput') videoInputRef!: ElementRef<HTMLInputElement>;
  videoFileValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (value instanceof File) {
        return null; // 上傳的是檔案
      }

      if (typeof value === 'string' && value.trim() !== '') {
        return null; // 是已回填的檔案 URL（或名稱）
      }

      return { required: true }; // 沒有檔案
    };
  }

  selectedVideoFileName: string | null = null
  onVideoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.videoForm.get('VideoFile')?.setValue(file);
      this.videoForm.get('VideoFile')?.markAsDirty(); // ✅ 加上這行
    }
  }
  findParentChapterID(index: number): number {
    for (let i = index - 1; i >= 0; i--) {
      if (this.steps[i].label === "新增章節") {
        return parseInt(this.steps[i].id!);
      }
    }
    return -1; // 找不到
  }

  //上一步
  async onPrev() {
    if (this.currentStep <= 0) return;

    const nowStep = this.steps[this.currentStep];
    const nowStepId = parseInt(nowStep.id!);

    // ⚠️ 若還沒儲存，要補儲存
    if (nowStepId === 0) {
      const CourseID = parseInt(this.steps[0].id!);
      const label = nowStep.label;

      try {
        switch (label) {
          case "新增章節":
            await this.AddChapterAPI(CourseID);
            break;
          case "新增影片":
            const chapterID = this.findParentChapterID(this.currentStep);
            await this.AddVideoAPI(chapterID);
            break;
        }
      } catch (err) {
        // 若儲存失敗就不繼續執行
        return;
      }
    }

    // 抓上一步資料
    const prevStep = this.steps[this.currentStep - 1];
    const prevID = parseInt(prevStep.id!);

    try {
      switch (prevStep.label) {
        case "建立課程":
          await this.GetCourseAPI(prevID);
          break;
        case "新增章節":
          await this.GetChapterAPI(prevID);
          break;
        case "新增影片":
          await this.GetVideoAPI(prevID);
          break;
      }

      Promise.resolve().then(() => {
        this.currentStep--;
        this.watchFormDirty();
      });
    } catch (error) {
      this.ShowMessage("error", "錯誤", `抓不到步驟${this.currentStep - 1}${prevStep.label}的資料`)
    }
  }

  //下一步
  //控制按鈕是否解鎖
  progressPercent = 0//顯示上傳進度
  isUploading = false;//顯示 loading bar 或是停用按鈕
  //切換下一步按鈕禁用
  ChangeBtnStatus() {
    this.lockButton = !this.lockButton
    if (this.lockButton) {
      this.courseForm.disable();
      this.chapterForm.disable();
      this.videoForm.disable();
    } else {
      this.courseForm.enable();
      this.chapterForm.enable();
      this.videoForm.enable();
    }
  }
  //顯示上傳進度
  ChangeUploadingStatus() {
    this.isUploading = !this.isUploading
  }
  //只會顯示在目前步驟不是最後一步
  async onNext() {
    if (this.currentStep === this.steps.length - 1) {
      return;
    }

    try {
      // 1. 確認資料庫是否有此課程
      const id = parseInt(this.steps[0].id!);
      const HasCourse = await this.CheckHasCourseAPI(id);
      console.log(HasCourse);
      if (!HasCourse) {
        await this.AddCourseAPI(); // 等待 SignalR percent 100 完成
      }

      // 2. 獲取下一步驟資訊
      const nextStep = this.steps[this.currentStep + 1];
      if (nextStep.id !== "0") {
        console.log("獲取下一步驟資訊");
        const nextId = parseInt(nextStep.id!);
        switch (nextStep.label) {
          case "新增章節":
            await this.GetChapterAPI(nextId);
            break;
          case "新增影片":
            await this.GetVideoAPI(nextId);
            break;
        }
      }

      // 3. 成功才移動步驟
      this.currentStep++;
      this.watchFormDirty();

    } catch (error) {
      console.error('onNext 發生錯誤：', error);
      this.ShowMessage("error", "錯誤", `無法執行下一步：${error || '未知錯誤'}`);
    }
  }

  //新增步驟
  addNewSteps() {
    if (this.currentStep !== this.steps.length - 1) {
      return
    }
    this.formValueChangeSub?.unsubscribe()
    // 2. 隱藏按鈕
    this.showEditButton = false;
    const label = this.steps[this.currentStep].label
    switch (label) {
      case "新增章節":
        this.addNewChapterStep();
        break;
      case "新增影片":
        this.addNewVideoStep();
        break;
    }
  }
  //是否顯示修改按鈕
  showEditButton = false;
  private formValueChangeSub?: Subscription;
  originalVideoFormValue: any = null;
  watchFormDirty() {
    this.showEditButton = false;
    if (this.formValueChangeSub) {
      this.formValueChangeSub.unsubscribe(); // 清掉上一次的訂閱
    }

    const label = this.steps[this.currentStep].label;


    let form: FormGroup;

    switch (label) {
      case "建立課程":
        form = this.courseForm;
        break;
      case "新增章節":
        form = this.chapterForm;
        break;
      case "新增影片":
        form = this.videoForm;
        break;
      default:
        return;
    }
    if (this.isCourseFirst) {
      this.isCourseFirst = !this.isCourseFirst
      return;
    }
    this.formValueChangeSub = form.valueChanges.subscribe(() => {
      switch (label) {
        case '新增影片':
          const current = JSON.stringify(this.videoForm.getRawValue());
          const baseline = JSON.stringify(this.originalVideoFormValue);
          this.showEditButton = current !== baseline;
          break;
        default:
          this.showEditButton = form.dirty;
          break;
      }
    });

  }

  async EditSteps() {
    const EditID = parseInt(this.steps[this.currentStep].id!)
    const EditLabel = this.steps[this.currentStep].label
    switch (EditLabel) {
      case "建立課程":
        await this.UpCourseAPI(EditID)
        Promise.resolve().then(() => {
          this.GetCourseAPI(EditID)
          this.watchFormDirty();
        });
        break;
      case "新增章節":
        await this.UpChapterAPI(EditID)
        Promise.resolve().then(() => {
          this.GetChapterAPI(EditID)
          this.watchFormDirty();
        });
        break;
      case "新增影片":
        await this.UpVideoAPI(EditID)
        await this.GetVideoAPI(EditID)
        this.watchFormDirty();

        break;
    }
  }
  async removeLastStep() {
    if (this.currentStep !== this.steps.length - 1) return;

    const id = parseInt(this.steps[this.currentStep].id!);
    const label = this.steps[this.currentStep].label;
    const PrevID = parseInt(this.steps[this.currentStep - 1].id!);
    const PrevLabel = this.steps[this.currentStep - 1].label
    switch (label) {
      case "新增章節":
        const HasChapter = await this.CheckHasChapterAPI(id);
        if (HasChapter) {
          await this.DelChapterAPI(id); // <- 確保完整 await
        }
        break;
      case "新增影片":
        const HasVideo = await this.CheckHasVideoAPI(id);
        if (HasVideo) {
          await this.DelVideoAPI(id); // <- 確保完整 await
        }
        break;
    }
    switch (PrevLabel) {
      case "新增章節":
        await this.GetChapterAPI(PrevID);
        break;
      case "新增影片":
        await this.GetVideoAPI(PrevID);
        break;
    }

    this.StepsRemoveLast();
    this.currentStep--;
    this.watchFormDirty();
  }


  //新增章節步驟
  addNewChapterStep() {
    this.CheckChapterAddVideoConfirm()
  }
  //新增影片步驟
  addNewVideoStep() {
    this.CheckVideoAddvVideoConfirm()
  }
  //確認使用者要什麼步驟
  CheckChapterAddVideoConfirm() {
    this.configService.confirm({
      message: '是否為此章節新增影片？',
      accept: async () => {
        if (parseInt(this.steps[this.currentStep].id!) === 0) {
          await this.AddChapterAPI(parseInt(this.steps[0].id!))
        }
        this.InitChapterForm()
        this.InitVideoForm()
        this.StepsPushVideo()
      },
      reject: async () => {
        await delay(200);
        this.CheckCourseAddChapterConfirm()
      }
    })
  }
  CheckVideoAddvVideoConfirm() {
    this.configService.confirm({
      message: '是否繼續為此章節新增影片？',
      accept: async () => {
        const ParentChapterID = this.findParentChapterID(this.currentStep)
        if (parseInt(this.steps[this.currentStep].id!) === 0) {
          await this.AddVideoAPI(ParentChapterID)
        }
        Promise.resolve().then(() => {
          this.InitChapterForm()
          this.InitVideoForm()
          this.StepsPushVideo()
        });
      },
      reject: async () => {
        await delay(200);
        this.CheckCourseAddChapterConfirm()
      }
    })
  }
  CheckCourseAddChapterConfirm() {
    this.configService.confirm({
      message: '是否繼續為此課程新增章節？',
      accept: async () => {
        if (this.steps[this.currentStep].label === "新增章節") {
          if (parseInt(this.steps[this.currentStep].id!) === 0) {
            await this.AddChapterAPI(parseInt(this.steps[0].id!))
          }
          this.InitChapterForm()
          this.InitVideoForm()
          this.StepsPushChapter()
        } else {
          const ParentChapterID = this.findParentChapterID(this.currentStep)
          if (parseInt(this.steps[this.currentStep].id!) === 0) {
            await this.AddVideoAPI(ParentChapterID)
          }
          this.InitChapterForm()
          this.InitVideoForm()
          this.StepsPushChapter()
        }
      },
      reject: async () => {
        if (this.steps[this.currentStep].label === "新增章節") {
          if (parseInt(this.steps[this.currentStep].id!) === 0) {
            await this.AddChapterAPI(parseInt(this.steps[0].id!))
          }
          this.InitChapterForm()
          this.InitVideoForm()
        } else {
          const ParentChapterID = this.findParentChapterID(this.currentStep)
          if (parseInt(this.steps[this.currentStep].id!) === 0) {
            await this.AddVideoAPI(ParentChapterID)
          }
          this.InitChapterForm()
          this.InitVideoForm()
        }
        await this.GetCourseAllDetails()
        await this.GetDepListAPI()
        await this.GetHashTagListAPI()
        this.StepsPushFinal()
      }
    })
  }
  //為Steps新增步驟 ***要改與API***
  StepsPushChapter() {
    this.steps.push({
      label: "新增章節",
      id: "0"
    })
    this.currentStep++
  }
  StepsPushVideo() {
    this.steps.push({
      label: "新增影片",
      id: "0"
    })
    this.currentStep++
  }
  StepsPushFinal() {
    this.steps.push({
      label: "確認建立課程",
      id: "0"
    })
    this.currentStep++
  }
  StepsRemoveLast() {
    this.steps.pop()
  }
  //打API
  ///-------------------
  clientRequestId = ""; // ✅ 產生唯一 ID
  private lastSub?: Subscription;
  private handleProgressAndTimeout(
    stepNames: string[] | string,
    clientRequestId: string, // ✅ 加這行
    resolve: () => void,
    reject: (reason?: any) => void
  ): Subscription {
    this.progressPercent = 0;
    let sub: Subscription;
    const steps = Array.isArray(stepNames) ? stepNames : [stepNames];
    let timeout: any;

    sub = this.signalR.progress$.subscribe(update => {
      console.log('📡 收到進度更新：', update);

      // ✅ 忽略非當前請求的推播
      if (update?.clientRequestId !== clientRequestId) return;

      if (update && update.step && steps.includes(update.step)) {
        const percent = update.data?.percent ?? 0;
        this.progressPercent = percent;

        if (percent === 100) {
          clearTimeout(timeout);
          sub.unsubscribe?.();
          this.ChangeBtnStatus();
          this.ChangeUploadingStatus();
          this.ShowMessage("success", "成功", `成功建立`);
          this.progressPercent = 0;
          resolve();
        } else {
          this.ShowMessage("info", "進度", update.data?.message ?? "");
        }
      }
    });

    timeout = setTimeout(() => {
      sub.unsubscribe?.();
      this.ChangeBtnStatus();
      this.ChangeUploadingStatus();
      this.progressPercent = 0;
      this.ShowMessage("error", "逾時", `上傳逾時，請重試`);
      reject(new Error("SignalR timeout"));
    }, 180000);

    return sub;
  }

  private callApiWithProgress<T>(
    request$: Observable<T>,
    stepNames: string[] | string,
    clientRequestId: string,
    onSuccess?: (res: T) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {

      this.ChangeUploadingStatus();
      this.ChangeBtnStatus();
      this.ShowMessage("info", "上傳中", "請稍後...");
      this.ShowMessage("success", "成功", `已送出，等待進度...`);

      // ✅ 取消上一個未完成的訂閱（防錯）
      if (this.lastSub?.unsubscribe) {
        this.lastSub.unsubscribe();
        this.lastSub = undefined;
      }
      // ✅ 儲存新的進度訂閱
      this.lastSub = this.handleProgressAndTimeout(stepNames, clientRequestId, resolve, reject);

      request$.subscribe({
        next: res => {
          onSuccess?.(res);
        },
        error: err => {
          this.ShowMessage("error", "失敗", err.message);
          this.lastSub?.unsubscribe(); // 防止永遠卡住
          reject(err);
        }
      });
    });
  }

  AddCourseAPI(): Promise<void> {
    if (!this.courseForm.valid) {
      this.ShowMessage('warn', "警告", "請輸入正確的資訊");
      return Promise.reject();
    }
    this.clientRequestId = uuidv4()
    return this.callApiWithProgress<number>(
      this.signalR.postCourse(this.courseForm, this.clientRequestId),
      ['Course:Started', 'Course:SavingToDb', 'Course:SavingImage', 'Course:Completed'],
      this.clientRequestId,
      res => {
        this.steps[0].id = res.toString();
        console.log(this.steps);
      }
    );
  }


  async AddChapterAPI(courseId: number): Promise<void> {
    if (!this.chapterForm.valid) {
      this.ShowMessage('warn', "警告", "請輸入正確的資訊");
      return Promise.reject();
    }

    try {
      const stepIndexForChapter = this.currentStep; // ✅ 先記下當下步驟索引
      this.clientRequestId = uuidv4();
      await this.callApiWithProgress<number>(
        this.signalR.postChapter(this.chapterForm, courseId, this.clientRequestId),
        ["Chapter:Started", "Chapter:SavingToDb", "Chapter:Completed"],
        this.clientRequestId,
        res => {
          this.steps[stepIndexForChapter].id = res.toString();
          console.log(this.steps);
        }
      );
      this.InitVideoForm()
      this.InitChapterForm(); // ✅ 呼叫成功後再清空
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async AddVideoAPI(id: number): Promise<void> {
    if (!this.videoForm.valid) {
      this.ShowMessage('warn', "警告", "請輸入正確的資訊");
      return Promise.reject();
    }
    try {
      const stepIndexForVideo = this.currentStep
      this.clientRequestId = uuidv4()
      await this.callApiWithProgress<number>(
        this.signalR.postVideo(this.videoForm, id, this.clientRequestId),
        ["Video:Upload", "Video:Started", "Video:SavingToDb", "Video:SavingFile", "Video:Completed"],
        this.clientRequestId,
        res => {
          this.steps[stepIndexForVideo].id = res.toString();
          console.log(this.steps);
        }
      );
      this.InitChapterForm()
      this.InitVideoForm()
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async CheckHasCourseAPI(id: number): Promise<boolean> {
    try {
      const result = await firstValueFrom(this.signalR.getCourse(id));
      return result != null && result.courseId === id;
    } catch (err) {
      console.warn('❌ Course 不存在或錯誤:', err);
      return false;
    }
  }

  async CheckHasChapterAPI(id: number): Promise<boolean> {
    try {
      const result = await firstValueFrom(this.signalR.getChapter(id));
      return result != null && result.chapterID === id;
    } catch (err) {
      console.warn('❌ Chapter 不存在或錯誤:', err);
      return false;
    }
  }

  async CheckHasVideoAPI(id: number): Promise<boolean> {
    try {
      const result = await firstValueFrom(this.signalR.getVideo(id));
      return result != null && result.videoID === id;
    } catch (err) {
      console.warn('❌ Video 不存在或錯誤:', err);
      return false;
    }
  }

  async GetChapterAPI(id: number): Promise<void> {
    this.InitChapterForm();
    try {
      const chapter = await firstValueFrom(this.signalR.getChapter(id));
      console.log(chapter);
      this.chapterForm.patchValue({
        ChapterTitle: chapter.chapterTitle,
        ChapterDes: chapter.chapterDes,
      });
    } catch (error) {
      console.log(error);
      this.ShowMessage("error", "取得章節失敗", "無法載入章節資料");
    }
  }

  async GetVideoAPI(id: number): Promise<void> {
    this.InitVideoForm();
    this.selectedVideoFileName = null
    try {
      const video = await firstValueFrom(this.signalR.getVideo(id));
      this.videoForm.patchValue({
        Title: video.title,
        VideoFile: video.videoFile
      });
      this.selectedVideoFileName = video.videoFile;
      // 標記為 pristine，避免 dirty 判斷為 true
      this.videoForm.markAsPristine();
      // 深複製 baseline 值（因為 Angular 會共享 reference）
      this.originalVideoFormValue = JSON.parse(JSON.stringify(this.videoForm.getRawValue()));
    } catch (error) {
      console.log(error);
      this.ShowMessage("error", "取得影片失敗", "無法載入影片資料");
    }
  }
  async GetCourseAllDetails(): Promise<void> {
    try {
      const courseId = parseInt(this.steps[0].id!)
      const data = await firstValueFrom(this.signalR.getCourseAllDetails(courseId))
      console.log(data);
      this.FinalCheck = {
        courseTitle: data.courseTitle,
        courseDes: data.courseDes,
        isPublic: data.isPublic,
        price: data.price,
        coverImagePath: data.coverImagePath,
        chapterWithVideos: data.chapterWithVideos
      }

    } catch (error) {
      console.log(error);
      this.ShowMessage('error', '錯誤', error)
    }
  }
  async GetCourseAPI(id: number): Promise<void> {
    console.log("進入GetCourseAPI");

    this.InitCourseForm(); // 清空表單
    this.coverPreviewUrl = 'assets/img/noimage.png'
    try {
      const course = await firstValueFrom(this.signalR.getCourse(id));
      this.courseForm.patchValue({
        CourseTitle: course.courseTitle,
        CourseDes: course.courseDes,
        IsPublic: (course.isPublic).toString(),
        Price: course.price,
        CoverImage: course.coverImage
      });
      // 👉 等 DOM 確定渲染後再設定 originalCoverImageUrl
      Promise.resolve().then(() => {
        console.log("cover from api", course.coverImage);
        this.originalCoverImageUrl$.next(course.coverImage);
      });
      this.coverPreviewUrl = `https://localhost:7073/images/${course.coverImage}`; // ⚠️ 請依實際網址修改
    } catch (error) {
      console.log(error);
      this.ShowMessage("error", "取得課程失敗", "無法載入課程資料");
    }
  }
  //告訴後端確認建立課程
  async CallBECompeleteAPI(): Promise<void> {
    this.ChangeBtnStatus()
    try {
      const courseID = parseInt(this.steps[0].id!);
      await firstValueFrom(this.signalR.putCourseFinal(courseID, false));
      this.ShowMessage("success", "成功", "成功建立課程");
    } catch (error) {
      console.error(error);
      this.ShowMessage("error", "失敗", "無法建立課程");
    } finally {
      this.ChangeBtnStatus()
    }
  }
  async AddCourseAccess() {
    try {
      const CourseAccess = this.CourseFinalGroup.get('DepFormControl') as FormControl<number[]>
      await firstValueFrom(this.signalR.postCourseAccess(CourseAccess, parseInt(this.steps[0].id!)))
    } catch (error) {

    }
  }
  async AddCourseHashTag() {
    try {
      const courseHashTag = this.CourseFinalGroup.get('HasTagFormControl') as FormControl<number[]>
      await firstValueFrom(this.signalR.postCourseHashTag(courseHashTag, parseInt(this.steps[0].id!)))
    } catch (error) {

    }
  }
  async finalizeCourse(): Promise<void> {
    try {
      if (this.CourseFinalGroup.invalid) {
        this.CourseFinalGroup.markAllAsTouched(); // 觸發錯誤顯示
        this.ShowMessage('warn', "警告", "請選擇至少一個部門和 課程標籤");
        return;
      }
      await this.AddCourseAccess()
      await this.AddCourseHashTag()
      await this.CallBECompeleteAPI()
      // ✅ 所有動作成功後再跳轉頁面
      this.ShowMessage("success", "成功", '成功建立課程')
      setTimeout(() => {
        this.router.navigate(['/back-system']);
      }, 2000);  // ← 改成你要跳轉的路由
    } catch (error) {

    }

  }

  Test() {
    this.GetDepListAPI()
    this.GetHashTagListAPI()
    // this.GetCourseAllDetails()
    console.log(this.CourseFinalGroup.value);

  }
  async GetDepListAPI(): Promise<void> {
    try {
      const depList = await firstValueFrom(this.signalR.getDepList());
      this.departmentOptions = depList
      console.log('部門清單：', depList);
    } catch (error) {
      console.error('讀取部門失敗：', error);
    }
  }
  async GetHashTagListAPI(): Promise<void> {
    try {
      const hashTagList = await firstValueFrom(this.signalR.getHashTagList());
      this.hashtagOptions = hashTagList
      console.log('Hashtag 清單：', hashTagList);
    } catch (error) {
      console.error('讀取 Hashtag 失敗：', error);
    }
  }
  async UpCourseAPI(id: number): Promise<void> {
    if (!this.courseForm.valid) {
      console.log(this.courseForm.errors);
      console.log(this.courseForm.getRawValue());
      this.ShowMessage('warn', "警告", "請輸入正確的資訊");
      return;
    }

    try {
      const coverValue = this.courseForm.get('CoverImage')?.value;
      const originalUrl = this.originalCoverImageUrl$.getValue();
      this.clientRequestId = uuidv4()
      if (typeof coverValue === 'string' && coverValue === originalUrl) {
        // 沒變更過封面圖，設為 null，避免 service API 驗證失敗
        this.courseForm.get('CoverImage')?.setValue(null);
      }
      await this.callApiWithProgress<RePutDTO>(
        this.signalR.putCourse(this.courseForm, id, this.clientRequestId),
        ["Course:Started", "Course:Processing", "Course:Completed"],  // ✅ 這才是後端實際使用的事件名稱
        this.clientRequestId,
        res => {

          this.ShowMessage("success", "成功", res.message);

          this.showEditButton = false
        }
      );

    } catch (error) {
      return Promise.reject(error);
    }
  }

  async UpChapterAPI(id: number): Promise<void> {
    if (!this.chapterForm.valid) {
      this.ShowMessage('warn', "警告", "請輸入正確的資訊");
      return;
    }

    try {
      this.clientRequestId = uuidv4()
      await this.callApiWithProgress<RePutDTO>(
        this.signalR.putChapter(this.chapterForm, id, this.clientRequestId),
        ["Chapter:Started", "Chapter:SavingToDb", "Chapter:Completed"], // ⚠️ 根據實際 signalR 事件名稱調整
        this.clientRequestId,
        res => {

          this.ShowMessage("success", "成功", res.message);

          this.showEditButton = false
          // 可視需要處理回傳訊息
        }
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async UpVideoAPI(id: number): Promise<void> {
    if (!this.videoForm.valid) {
      this.ShowMessage('warn', "警告", "請輸入正確的資訊");
      return;
    }

    try {
      const videoValue = this.videoForm.get('VideoFile')?.value;
      if (typeof videoValue === 'string' && videoValue === this.selectedVideoFileName) {
        this.videoForm.get('VideoFile')?.setValue(null);
      }
      const hasNewFile = this.videoForm.get('VideoFile')?.value instanceof File;
      const steps = hasNewFile
        ? ['Video:Upload', "Video:Started", "Video:SavingToDb", "Video:SavingFile", 'Video:Completed']
        : ["Video:Started", 'Video:Completed'];
      this.clientRequestId = uuidv4()
      await this.callApiWithProgress<RePutDTO>(
        this.signalR.putVideo(this.videoForm, id, this.clientRequestId),
        steps, // ✅ 更新時仍可沿用相同步驟
        this.clientRequestId,
        res => {

          this.ShowMessage("success", "成功", res.message);

          this.showEditButton = false
          // 可視需要處理回傳訊息
        }
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async DelChapterAPI(id: number): Promise<void> {
    try {
      await firstValueFrom(this.signalR.delChapter(id));
      this.ShowMessage('success', '章節刪除成功', `章節 ID: ${id} 已刪除`);
    } catch (error) {
      this.ShowMessage('error', '刪除章節失敗', error || '請稍後再試');
      return Promise.reject(error);
    }
  }

  async DelVideoAPI(id: number): Promise<void> {
    try {
      await firstValueFrom(this.signalR.delVideo(id));
      this.ShowMessage('success', '影片刪除成功', `影片 ID: ${id} 已刪除`);
    } catch (error) {
      this.ShowMessage('error', '刪除影片失敗', error || '請稍後再試');
      return Promise.reject(error);
    }
  }

  //---------------------
  //顯示右邊訊息
  ShowMessage(type: string, summary: string, detail: any) {
    this.messageService.add({
      severity: type,
      summary: summary,
      detail: detail
    })
  }
  //取消訂閱或中斷 SignalR 連線
  ngOnDestroy(): void {
    this.formValueChangeSub?.unsubscribe();
    this.signalR.disconnect(); // 如果有手動斷線機制的話
  }
}
