export interface courseDTO {
  id: number;               // CourseID
  title: string;            // Title
  description: string;      // Description
  price: number;            // Price
  coverImage: string;       // CoverImage
  isPublic?: boolean;       // IsPublic（可選）
  companyId: number;        // CompanyID
  companyName?: string;     // 前端顯示用（JOIN 後帶回）
}
