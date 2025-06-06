import { ConfigService } from './../../services/config.service';
import { Component, ElementRef, OnInit, ViewChild, Pipe } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CourseSignalrService } from 'src/app/services/course.service/course-signalr.service';
import { courseDTO, chapterDTO, videoDTO } from "../../Interface/createCourseDTO";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class CreateCourseComponent {
  constructor(private signalR: CourseSignalrService,
    private messageService: MessageService,
    private configService: ConfirmationService
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
  //第二步驟章節表單是否第一次輸入
  isChapterFirst = true
  ngOnInit() {
    this.signalR.connect();
    // 開始監聽 SignalR 回傳進度
    this.signalR.progress$.subscribe(update => {
      if (update && update.step === 'CourseCreated') {
        this.progressPercent = update.data.percent;
        if (update.data.percent === 100) {
          this.ChangeBtnStatus();
          this.ChangeUploadingStatus()
          this.progressPercent = 0
        }
      }
    });
  }
  //課程表單
  courseForm = new FormGroup<courseDTO>({
    CompanyId: new FormControl(1),
    CourseTitle: new FormControl("6666"),
    CourseDes: new FormControl("777"),
    IsPublic: new FormControl("true"),
    CoverImage: new FormControl(), // 這裡先不給字串，會用 <input type="file"> 補上 File
    Price: new FormControl(9999),
  });
  //章節表單
  chapterForm = new FormGroup<chapterDTO>({
    CourseId: new FormControl(),
    ChapterTitle: new FormControl(),
    ChapterDes: new FormControl()
  })
  //影片表單
  videoForm = new FormGroup<videoDTO>({
    ChapterId: new FormControl(),
    Title: new FormControl(),
    VideoFile: new FormControl()
  })
  //初始化課程表單
  InitCourseForm() {
    this.courseForm.reset()
  }
  //初始化章節表單
  InitChapterForm() {
    this.chapterForm.reset()
  }
  //初始化影片表單
  InitVideoForm() {
    this.videoForm.reset()
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
  onVideoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.videoForm.get('VideoFile')?.setValue(file);
      const reader = new FileReader()
      reader.onload = () => this.coverPreviewUrl = reader.result as string
      reader.readAsDataURL(file)
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
  onPrev() {
    if (this.currentStep < 0) {
      return
    }
    const CourseID = parseInt(this.steps[0].id!)
    const nowStepId = parseInt(this.steps[this.currentStep].id!)
    const nowSteLable = this.steps[this.currentStep].label
    if (nowStepId === 0) {
      switch (nowSteLable) {
        case "新增章節":
          this.AddChapterAPI(CourseID)
          break;
        case "新增影片":
          const ParentChapterID = this.findParentChapterID(this.currentStep)
          this.AddVideoAPI(ParentChapterID)
      }
    } else {
      const Prevlabel = this.steps[this.currentStep - 1].label
      const PrevID = parseInt(this.steps[this.currentStep - 1].id!)
      switch (Prevlabel) {
        case "建立課程":
          this.GetCourseAPI(PrevID)
          this.currentStep--
          break;
        case "新增章節":
          this.GetChapterAPI(PrevID)
          this.currentStep--
          break;
        case "新增影片":
          this.GetVideoAPI(PrevID)
          this.currentStep--
          break;
      }
    }
    this.ShowMessage("error", "錯誤", `抓不到步驟${this.currentStep - 1}${this.steps[this.currentStep - 1].label}的資料`)


  }
  //下一步
  lockButton = false //控制按鈕是否解鎖
  progressPercent = 0//顯示上傳進度
  isUploading = false;//顯示 loading bar 或是停用按鈕
  //切換下一步按鈕禁用
  ChangeBtnStatus() {
    this.lockButton = !this.lockButton
  }
  //顯示上傳進度
  ChangeUploadingStatus() {
    this.isUploading = !this.isUploading
  }
  //只會顯示在目前步驟不是最後一步
  onNext() {
    if (this.currentStep === this.steps.length - 1) {
      return
    }
    //確認資料庫是否有此課程
    const id = parseInt(this.steps[0].id!)
    if (!this.CheckHasCourseAPI(id)) {
      this.AddCourseAPI()
    }
    //獲取下一步驟資訊
    if (this.steps[(this.currentStep + 1)].id !== "0") {
      const id = parseInt(this.steps[(this.currentStep + 1)].id!)
      const label = this.steps[(this.currentStep + 1)].label
      switch (label) {
        case "新增章節":
          this.GetChapterAPI(id)
          break;
        case "新增影片":
          this.GetVideoAPI(id)
          break;
      }
    } else {
      //為了第二步驟新增章節
      this.currentStep++
    }
  }
  //新增步驟
  addNewSteps() {
    if (this.currentStep !== this.steps.length - 1) {
      return
    }
    const label = this.steps[this.currentStep].label
    switch (label) {
      case "新增章節":
        this.addNewChapterStep();
        break;
      case "新增章節":
        this.addNewVideoStep();
        break;
    }
  }
  //是否顯示修改按鈕
  showEditButton = false;
  private formValueChangeSub?: Subscription;
  watchFormDirty() {
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
    } else if (this.isChapterFirst) {
      this.isChapterFirst = !this.isChapterFirst
      return;
    }
    this.formValueChangeSub = form.valueChanges.subscribe(() => {
      this.showEditButton = form.dirty;
    });
  }

  EditSteps() {
    const EditID = parseInt(this.steps[this.currentStep].id!)
    const EditLabel = this.steps[this.currentStep].label
    switch (EditLabel) {
      case "建立課程":
        this.UpCourseAPI(EditID)
        break;
      case "新增章節":
        this.UpChapterAPI(EditID)
        break;
      case "新增影片":
        this.UpVideoAPI(EditID)
        break;
    }
  }
  removeLastStep() {
    if (this.currentStep === this.steps.length - 1) {
      return
    }
    const id = parseInt(this.steps[this.currentStep].id!)
    const label = this.steps[this.currentStep].label
    switch (label) {
      case "新增章節":
        if (this.CheckHasChapterAPI(id)) {
          this.DelChapterAPI()
          this.StepsRemoveLast()
          this.currentStep--
        } else {
          this.StepsRemoveLast()
          this.currentStep--
        }
        break;
      case "新增章節":
        if (this.CheckHasVideoAPI(id)) {
          this.DelVideoAPI()
          this.StepsRemoveLast()
          this.currentStep--
        } else {
          this.StepsRemoveLast()
          this.currentStep--
        }
        break;
    }
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
      accept: () => {
        this.AddChapterAPI(parseInt(this.steps[0].id!))
      },
      reject: () => {
        setTimeout(() => {
          this.CheckCourseAddChapterConfirm()
        }, 200);
      }
    })
  }
  CheckVideoAddvVideoConfirm() {
    this.configService.confirm({
      message: '是否繼續為此章節新增影片？',
      accept: () => {
        const ParentChapterID = this.findParentChapterID(this.currentStep)
        this.AddVideoAPI(ParentChapterID)
      },
      reject: () => {
        setTimeout(() => {
          this.CheckCourseAddChapterConfirm()
        }, 200);
      }
    })
  }
  CheckCourseAddChapterConfirm() {
    this.configService.confirm({
      message: '是否繼續為此課程新增章節？',
      accept: () => {
        if (this.steps[this.currentStep].label === "新增章節") {
          this.AddChapterAPI(parseInt(this.steps[0].id!))
        } else {
          const ParentChapterID = this.findParentChapterID(this.currentStep)
          this.AddVideoAPI(ParentChapterID)
        }
      },
      reject: () => {
        setTimeout(() => {
          this.StepsPushFinal()
        }, 200);
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

  AddCourseAPI() {
    if (this.courseForm.valid) {
      this.ChangeUploadingStatus()//顯示上傳進度
      this.ChangeBtnStatus()//禁用按鈕
      this.ShowMessage("info", "上傳中", "請稍後...")
      this.signalR.postCourse(this.courseForm).subscribe({
        next: res => {
          // loading 狀態中，等待 SignalR 回傳
          this.ShowMessage("success", "成功", res)
        },
        error: err => {
          this.ShowMessage("error", "失敗", err.message)
        }
      });
    } else {
      this.ShowMessage('warn', "警告", "請輸入正確的資訊")
    }
  }
  AddChapterAPI(id: number) {
    if (this.chapterForm.valid) {

    } else {
      this.ShowMessage('warn', "警告", "請輸入正確的資訊")
    }
  }
  AddVideoAPI(id: number) {
    if (this.videoForm.valid) {

    } else {
      this.ShowMessage('warn', "警告", "請輸入正確的資訊")
    }
  }
  CheckHasCourseAPI(id: number): boolean {
    return true
  }
  CheckHasChapterAPI(id: number): boolean {
    return true
  }
  CheckHasVideoAPI(id: number): boolean {
    return true
  }
  CallBECompeleteAPI() {

  }
  GetCourseAPI(id: number) {
    this.InitCourseForm()
  }
  GetChapterAPI(id: number) {

  }
  GetVideoAPI(id: number) {

  }
  UpCourseAPI(id: number) {
    if (this.courseForm.valid) {

    } else {
      this.ShowMessage('warn', "警告", "請輸入正確的資訊")
    }
  }
  UpChapterAPI(id: number) {
    if (this.chapterForm.valid) {

    } else {
      this.ShowMessage('warn', "警告", "請輸入正確的資訊")
    }
  }
  UpVideoAPI(id: number) {
    if (this.videoForm.valid) {

    } else {
      this.ShowMessage('warn', "警告", "請輸入正確的資訊")
    }
  }
  DelChapterAPI() {

  }
  DelVideoAPI() {

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
  ngOnDestroy() {
    this.signalR.disconnect();
  }
}
