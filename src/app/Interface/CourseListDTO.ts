export interface ResCourseBgListDTO {
  courseId: number,
  courseTitle: string,
  isPublic: boolean,
  courseHashTags: number[]
}
export interface HashTagListDTO {
  hashTagId: number,
  hashTagName: string
}
export interface EmployeeAccessView {
  userId: number;
  username: string;
  email: string;
  userDep: number;
  hasAccess: boolean;            // ⬅️ 前端用來判斷 checkbox 預設是否勾選
  courseAccessId?: number;       // ⬅️ 若有權限，要保留此 ID，取消權限時用
}
