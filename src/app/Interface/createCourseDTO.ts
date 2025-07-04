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
  ConnectionId: string,
  clientRequestId: string
}
export interface ReqFinalDTO {
  IsDraft: boolean,
  ConnectionId: string
}
export interface ReqCourseAccessDTO {
  courseId: number,
  depIds: number[]
}
export interface ReqCourseHashTagDTO {
  courseId: number,
  hashTagIds: number[]
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
  chapterID: number
  courseId: number,          // CourseID
  chapterTitle: string,      // ChapterTitle
  chapterDes: string        // CourseDescription
}
export interface ResVideoDTO {
  videoID: number,
  chapterId: number,         // ChapterId
  title: string,             // VideoTitle
  videoFile: string           // VideoFile
}
export interface ResDepDTO {
  depId: number,               // depId
  depName: string,             // depName
}
export interface ResHashTagDTO {
  hashTagId: number,            // hashTagId
  hashTagName: string,          // hashTagName
}
export interface ResCourseAllDetailsDTO {
  courseTitle: string,      // CourseTitle
  courseDes: string,        // CourseDescription
  isPublic: boolean,        // IsPublic（可選）
  price: number,            // Price
  coverImagePath: string,         // CoverImage File
  chapterWithVideos: ChapterWithVideosDTO[]
}
export interface ChapterWithVideosDTO {
  chapterTitle: string,      // ChapterTitle
  chapterDes: string,        // CourseDescription
  videos: FinalVideosDTO[]
}

export interface FinalVideosDTO {
  videoTitle: string,      // ChapterTitle
  videoFile: string        // CourseDescription
}
