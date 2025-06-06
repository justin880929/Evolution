// src/app/Interface/editUserResponseDTO.ts
export interface EditUserResponseDTO {
  userInfo: {
    userId:   number;
    username: string;
    depName:  string;
    email:    string;
    photoUrl: string;
  };
  newAccessToken: string;
}
