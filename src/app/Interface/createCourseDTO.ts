export interface courseDTO {
  CourseTitle: string;      // CourseTitle
  CourseDes: string;        // CourseDescription
  IsPublic: boolean;        // IsPublic（可選）
  Price: number;            // Price
  CoverImage: File;         // CoverImage File
  CompanyId: number;        // CompanyID
}
export interface chapterDTO {
  CourseId: number;          // CourseID
  ChapterTitle: string;      // ChapterTitle
  ChapterDes: string;        // CourseDescription
}
export interface videoDTO {
  ChapterId: number;         // ChapterId
  Title: string;             // VideoTitle
  VideoFile: File;           // VideoFile
}
