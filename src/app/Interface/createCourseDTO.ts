import { FormControl } from "@angular/forms";
export interface RePutDTO {
  success: boolean;
  message?: string;
  errors?: string[];
  statusCode?: number;
}
export interface courseDTO {
  CourseTitle: FormControl,      // CourseTitle
  CourseDes: FormControl,        // CourseDescription
  IsPublic: FormControl,        // IsPublic（可選）
  Price: FormControl,            // Price
  CoverImage: FormControl,         // CoverImage File
  CompanyId: FormControl        // CompanyID
}
export interface chapterDTO {
  ChapterTitle: FormControl,      // ChapterTitle
  ChapterDes: FormControl        // CourseDescription
}
export interface videoDTO {
  Title: FormControl,             // VideoTitle
  VideoFile: FormControl           // VideoFile
}
//Request請求格式
export interface ReqChapterDTO {
  CourseId: number,          // CourseID
  ChapterTitle: string,      // ChapterTitle
  ChapterDes: string,       // CourseDescription
  ConnectionId: string
}
export interface ReqFinalDTO {
  IsDraft: boolean,
  ConnectionId: string
}
//Response回傳格式
export interface ResCourseDTO {
  courseId: number,
  courseTitle: string,      // CourseTitle
  courseDes: string,        // CourseDescription
  isPublic: boolean,        // IsPublic（可選）
  price: number,            // Price
  coverImage: string,         // CoverImage File
  companyId: number        // CompanyID
}
export interface ResChapterDTO {
  chapterId: number
  courseId: number,          // CourseID
  chapterTitle: string,      // ChapterTitle
  chapterDes: string        // CourseDescription
}
export interface ResVideoDTO {
  videoId: number,
  chapterId: number,         // ChapterId
  title: string,             // VideoTitle
  videoFile: string           // VideoFile
}
