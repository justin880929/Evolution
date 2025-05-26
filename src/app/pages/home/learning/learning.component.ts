import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {
  steps: MenuItem[] = [];
  currentStepIndex = 0;
  flattenedSteps: { type: 'chapter' | 'video'; data: any }[] = [];
  activeTabIndex = 0;

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
    this.courseData.chapters.forEach((chapter: any, idx: number) => {
      this.steps.push({ label: `章節 ${idx + 1}` });
      this.flattenedSteps.push({ type: 'chapter', data: chapter });

      if (chapter.videoUrl) {
        this.steps.push({ label: `章節 ${idx + 1} 影片` });
        this.flattenedSteps.push({ type: 'video', data: chapter });
      }
    });
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

  goToQuiz() {
    this.activeTabIndex = 1;
  }
}
