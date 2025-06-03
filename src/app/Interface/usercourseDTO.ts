export interface usercourseDTO {
  /** 課程主鍵 */
  courseId: number;

  /**
   * 購買來源
   * - 'personal'：使用者自行購買
   * - 'company'：公司授權 (Company 購買後開放給員工)
   */
  source: 'personal' | 'company';

  /**
   * 課程發布的公司
   * 如果你只要顯示名稱，就放 string；若要顯示更多公司資訊，也可以改成 companyId: number，
   * 或是另外加一個 CompanyInfo 物件。
   */
  companyName: string;

  /** 課程標題 */
  title: string;

  /** 課程描述 */
  description: string;

  /** 課程封面照片的完整 URL */
  coverImageUrl: string;
}
