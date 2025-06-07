export interface EmpOrderDTO {
  /** 課程 Id */
  courseId: number;
  /** 課程所屬公司 Id */
  companyId: number;
  /** 公司名稱 */
  companyName: string;
  /** 課程標題 */
  courseTitle: string;
  /** 課程描述（可選） */
  courseDes?: string;
  /** 封面圖片路徑 */
  coverImagePath: string;
}
