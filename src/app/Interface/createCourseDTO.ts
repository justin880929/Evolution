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
  ChapterDes: string        // CourseDescription
}
//Response回傳格式
export interface ResCourseDTO {
  CourseID: number,
  CourseTitle: string,      // CourseTitle
  CourseDes: string,        // CourseDescription
  IsPublic: boolean,        // IsPublic（可選）
  Price: number,            // Price
  CoverImage: string,         // CoverImage File
  CompanyId: number        // CompanyID
}
export interface ResChapterDTO {
  ChapterID: number
  CourseId: number,          // CourseID
  ChapterTitle: string,      // ChapterTitle
  ChapterDes: string        // CourseDescription
}
export interface ResVideoDTO {
  VideoID: number,
  ChapterId: number,         // ChapterId
  Title: string,             // VideoTitle
  VideoFile: string           // VideoFile
}
