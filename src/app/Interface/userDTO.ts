export interface UserDTO {
  name: string;          // 顯示
  email: string;             // 顯示
  dep: string;        // 顯示：會轉換 UserDep -> Dep 名稱
  pic:string;          // 顯示：使用者頭像圖片 URL，若沒有則為 null 或空字串
  company: string;      // 顯示：公司名稱，若沒有則為 null 或空字串
}
