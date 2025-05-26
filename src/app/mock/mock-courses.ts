import { courseDTO } from "../Interface/courseDTO";

export const MOCK_COURSES: courseDTO[] = [
  {
    id: 1,
    title: 'Angular 入門教學',
    companyId: 1,
    companyName: '資策會',
    description: '從零開始學習 Angular 前端框架。',
    price: 1800,
    coverImage: 'assets/img/angular.png',
    isPublic: true
  },
  {
    id: 2,
    title: 'Node.js API 開發',
    companyId: 2,
    companyName: '後端職人學院',
    description: '使用 Node.js 快速開發 RESTful API。',
    price: 2200,
    coverImage: 'assets/img/nodejs.png',
    isPublic: true
  }
  // ...其他課程
];
