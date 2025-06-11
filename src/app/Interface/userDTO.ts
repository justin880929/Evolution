export interface UserDTO {
  name:    string;   // 顯示用的 username
  email:   string;   // 顯示用的 email
  dep:     string;   // 顯示用的 部門名稱
  pic:     string;   // 顯示用的 頭像完整 URL（後端 photoUrl）
  company: string;   // 顯示用的 公司名稱（後端 userCompany）
}
