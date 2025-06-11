export interface CourseWithTagDto {
  courseId: number;
  companyId: number;
  companyName: string;
  courseTitle: string;
  courseDes?: string;
  isPublic: boolean;
  coverImagePath: string;
  tagIds: number[];
}
