// src/app/interfaces/empDTO.ts
export interface empDTO {
  userID: number;            // 不顯示，但用來修改用
  username: string;          // 顯示
  email: string;             // 顯示
  department: string;        // 顯示：會轉換 UserDep -> Dep 名稱
  isEmailConfirmed: boolean; // 顯示（用小圖示或 Tag 顯示）
}
