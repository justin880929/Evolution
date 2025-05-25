import { courseDTO } from "../Interface/courseDTO";


export const MOCK_COURSES: courseDTO[] = [
  {
    id: 1,
    title: 'Angular 入門教學',
    company: '資策會',
    description: '從零開始學習 Angular 前端框架。',
    price: 1800,
    imageUrl: 'assets/img/angular.png'
  },
  {
    id: 2,
    title: 'Node.js API 開發',
    company: '後端職人學院',
    description: '使用 Node.js 快速開發 RESTful API。',
    price: 2200,
    imageUrl: 'assets/img/nodejs.png'
  },
  {
    id: 3,
    title: 'SQL 數據查詢技巧',
    company: '資料學堂',
    description: '強化你在資料庫中的查詢能力。',
    price: 1500,
    imageUrl: 'assets/img/sql.png'
  },
  {
    id: 4,
    title: 'Docker 容器技術',
    company: 'DevOps 學院',
    description: '學會用 Docker 封裝與部署應用。',
    price: 2100,
    imageUrl: 'assets/img/docker.png'
  },
  {
    id: 5,
    title: 'React SPA 開發',
    company: '前端工坊',
    description: '打造高效能單頁應用程式。',
    price: 2300,
    imageUrl: 'assets/img/react.png'
  },
  {
    id: 6,
    title: 'Python 數據分析',
    company: 'AI 開發坊',
    description: '用 Python 處理資料與視覺化分析。',
    price: 2400,
    imageUrl: 'assets/img/python.png'
  },
  {
    id: 7,
    title: 'AI 機器學習實作',
    company: 'AI 開發坊',
    description: '入門 AI 與機器學習概念與實作。',
    price: 2700,
    imageUrl: 'assets/img/ai.png'
  },
  {
    id: 8,
    title: 'Git 團隊協作實戰',
    company: '程式碼工坊',
    description: '使用 Git 打造高效多人協作流程。',
    price: 1600,
    imageUrl: 'assets/img/git.png'
  }
];
