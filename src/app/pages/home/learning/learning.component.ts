import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css'],
})
export class LearningComponent implements OnInit {
  steps: MenuItem[] = [];
  currentStepIndex = 0;
  flattenedSteps: { type: 'chapter' | 'video'; data: any }[] = [];
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
  courseData = {
    title: 'Angular 入門課程',
    chapters: [
      {
        title: '第一章：認識 Angular',
        content: '這一章會介紹 Angular 的基本概念與歷史背景。',
        videoUrl: 'https://www.example.com/video1.mp4',
      },
      {
        title: '第二章：Component 與模組',
        content: '這一章會學到如何建立 Component 與使用模組。',
        videoUrl: 'https://www.example.com/video2.mp4',
      },
    ],
  };

  ngOnInit(): void {
    window.scrollTo({ top: 0 });
    this.courseData.chapters.forEach((chapter: any, idx: number) => {
      this.steps.push({ label: `章節 ${idx + 1}` });
      this.flattenedSteps.push({ type: 'chapter', data: chapter });

      if (chapter.videoUrl) {
        this.steps.push({ label: `章節 ${idx + 1} 影片` });
        this.flattenedSteps.push({ type: 'video', data: chapter });
      }
    });
  }
  searchValue: string = '';

  get filteredQuizzes() {
    if (!this.searchValue) return this.quizzes;
    return this.quizzes.filter((q) =>
      q.name.toLowerCase().includes(this.searchValue.toLowerCase())
    );
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
