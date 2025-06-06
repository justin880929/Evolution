import { FormControl } from "@angular/forms";

export interface courseDTO {
  CourseTitle: FormControl;      // CourseTitle
  CourseDes: FormControl;        // CourseDescription
  IsPublic: FormControl;        // IsPublic（可選）
  Price: FormControl;            // Price
  CoverImage: FormControl;         // CoverImage File
  CompanyId: FormControl;        // CompanyID
}
export interface chapterDTO {
  CourseId: FormControl;          // CourseID
  ChapterTitle: FormControl;      // ChapterTitle
  ChapterDes: FormControl;        // CourseDescription
}
export interface videoDTO {
  ChapterId: FormControl;         // ChapterId
  Title: FormControl;             // VideoTitle
  VideoFile: FormControl;           // VideoFile
}
