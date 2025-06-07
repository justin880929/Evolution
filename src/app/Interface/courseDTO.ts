export interface CourseDto {
  courseId: number;
  companyId: number;
  companyName: string;
  courseTitle: string;
  courseDes?: string;
  isPublic: boolean;
  coverImagePath: string;
  price: number;
}
