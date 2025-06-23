import { map, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ResultService } from 'src/app/Share/result.service';
import { ResCourseAllDetailsDTO } from '../../../Interface/createCourseDTO';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css'],
})
export class LearningComponent implements OnInit {
  steps: MenuItem[] = [];

  courseId!: number;
  flattenedSteps: { type: 'chapter' | 'video'; data: any }[] = [];
  currentStepIndex = 0;
  activeTabIndex = 0;
  quizzes = [
    { name: 'Docker 基礎測驗', score: 58, status: '不通過' },
    { name: 'Kubernetes 初階', score: 85, status: '通過' },
    { name: 'CI/CD 概念測驗', score: 60, status: '通過' },
    { name: '版本控制測驗', score: 55, status: '不通過' },
    { name: 'DevOps 理論', score: 72, status: '通過' },
    { name: '雲端架構入門', score: 48, status: '不通過' },
    { name: '測試自動化入門', score: 63, status: '通過' },
    { name: 'Linux CLI 測驗', score: 59, status: '不通過' },
    { name: '安全性概論', score: 91, status: '通過' },
    { name: '資料庫設計', score: 62, status: '通過' },
    { name: 'Docker 進階測驗', score: 77, status: '通過' },
  ];
  // 假資料
  courseData: any; // 或明確型別
  constructor(
    private route: ActivatedRoute,
    private result: ResultService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get('id')!;
    this.getCourseAPI(this.courseId).subscribe((res) => {
      this.courseData = res;
      this.buildSteps();
    });
  }
  searchValue: string = '';

  get filteredQuizzes() {
    if (!this.searchValue) return this.quizzes;
    return this.quizzes.filter((q) =>
      q.name.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }
  isCallAI = false;
  isLoading = false;
  summaryList: string[] = [];
  CallVideoAPI() {
    this.summaryList = [];
    this.isCallAI = true;
    this.isLoading = true; // 進入載入狀態
    const videoId = this.flattenedSteps[this.currentStepIndex].data.videoId;
    const url = `https://localhost:7274/api/VideoWithOpenAI/${videoId}`;
    this.result.getResult<string>(url).subscribe({
      next: (res: string) => {
        const cleaned = res
          .replace(/^"/, '') // 去除開頭的雙引號（"）
          .replace(/"$/, '') // 去除結尾的雙引號
          .replace(/\\n/g, '\n'); // 處理 \n 換行

        this.summaryList = cleaned
          .split('\n')
          .map((line) => line.replace(/^\d+\.\s*/, '').trim()) // 移除開頭的數字點與空格
          .filter((line) => !!line);
        this.isLoading = false;
      },
      error: (err) => {
        this.summaryList = [];
        this.isLoading = false; // ❗很重要：讓錯誤 UI 能顯示
        this.ShowMessage('error', '錯誤', 'AI 分析失敗，請稍後再試');
      },
    });
  }
  copyResultToClipboard() {
    // 將 AIResult 中的 \n 轉成真正的換行符號

    navigator.clipboard.writeText(this.summaryList.join('\n')).then(() => {
      this.ShowMessage('success', '成功', '已複製摘要到剪貼簿');
    });
  }
  ShowMessage(type: string, summary: string, detail: any) {
    this.messageService.add({
      key: 'tc',
      severity: type,
      summary: summary,
      detail: detail,
    });
  }
  getCourseAPI(courseId: number): Observable<any> {
    const url = `https://localhost:7274/api/CreateCourse/learn/${courseId}`;
    return this.result.getResult(url);
  }
  buildSteps() {
    this.steps = [];
    this.flattenedSteps = [];

    this.courseData.chapterWithVideos.forEach((chapter: any, idx: number) => {
      // 章節步驟
      this.steps.push({ label: `章節 ${idx + 1}` });
      this.flattenedSteps.push({
        type: 'chapter',
        data: {
          chapterTitle: chapter.chapterTitle,
          chapterDes: chapter.chapterDes,
        },
      });

      // 章節底下影片步驟
      chapter.videos.forEach((video: any, vidx: number) => {
        this.steps.push({ label: `章節 ${idx + 1}-影片 ${vidx + 1}` }); // 改這裡，加上章節編號
        this.flattenedSteps.push({
          type: 'video',
          data: {
            videoId: video.videoId,
            videoTitle: video.videoTitle,
            videoFile: `https://localhost:7274/videos/${video.videoFile}`, // 保留原始檔名，供 getVideoUrl 用
          },
        });
      });
    });
  }

  goToQuiz(quiz: any) {
    console.log('前往測驗：', quiz.name);
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case '通過':
        return 'badge pass-bg-color';
      case '不通過':
        return 'badge notpass-bg-color';
      default:
        return 'badge bg-secondary';
    }
  }

  getScoreColor(score: number): string {
    return score >= 60 ? ' pass-color' : 'notpass-color';
  }
  get currentStep() {
    return this.flattenedSteps[this.currentStepIndex];
  }

  nextStep() {
    if (this.currentStepIndex < this.flattenedSteps.length - 1) {
      this.currentStepIndex++;
      window.scrollTo({ top: 0 });
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  isLastStep(): boolean {
    return this.currentStepIndex === this.flattenedSteps.length - 1;
  }

  goToQuizPage() {
    this.activeTabIndex = 1;
  }
}
