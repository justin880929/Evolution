export interface UserInfoDTO {
  userId:      number;
  username:    string;
  userCompany: string;      // 後端會回完整的公司名稱
  email:       string;
  depName:     string;
  userPicPath: string | null;
  photoUrl:    string | null;
}
