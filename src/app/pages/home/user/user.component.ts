import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../../../services/user.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { courseDTO } from 'src/app/Interface/courseDTO';
import { UserDTO } from 'src/app/Interface/userDTO';
import { CourseService } from 'src/app/services/course.service/course.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user!: UserDTO;
  errorMsg: string | null = null;
  private sub!: Subscription;

  // Reactive Form
  userForm!: FormGroup;
  isEditing = false;

  // 用來暫存「新大頭照的 Data URL」或「本地檔案路徑」以便畫面預覽
  previewPicUrl: string | null = null;
  // 用來暫存使用者挑選的 File，方便 onSubmit 時把它放到 FormData 傳給後端
  selectedFile: File | null = null;

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0 });
  }

  // 取得隱藏的 <input type="file">，讓我們可以透過程式觸發 click()
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  courses: courseDTO[] = [];

  constructor(private courseService: CourseService,private userService:UserService,private fb: FormBuilder) { }

  ngOnInit(): void {
    // 1. 先初始化一個 FormGroup，但先留空值。拿到 this.user 後再 patchValue
    this.userForm = this.fb.group({
  username:  ['', [Validators.required]],             // 對應後端 DTO.Username
  userEmail: ['', [Validators.required, Validators.email]], // 對應後端 DTO.UserEmail
  company:   [''],  // 如果後端不處理就放空或只做顯示
  dep:       [''],  // 對應後端 DTO.Department
  photoFile: ['']   // 對應後端 DTO.PhotoFile
});
    // 2. 拿課程列表
    this.courseService.getCourses().subscribe((data) => {
      this.courses = data;
    });

    // 3. 拿使用者資訊後，把它 patch 到 form，也存到 this.user
    this.sub = this.userService.getUserInfo().subscribe({
    next: (data: UserDTO) => {
    this.user = data;

    // patchValue 要用跟上面 formGroup 一致的 key
    this.userForm.patchValue({
      username:  this.user.name,   // 原本撈到的 name → 塞進 username
      userEmail: this.user.email,  // 對應 email → 塞進 userEmail
      company:   this.user.company,
      dep:       this.user.dep,
      // photoFile 並不直接放 url，只要在預覽時自行設 this.previewPicUrl
    });

    // 預覽從 this.user.pic (完整 URL) 直接顯示
    this.previewPicUrl = this.user.pic;
  },
  error: (err) => {
    console.error('取得使用者資訊失敗：', err);
    this.errorMsg = '無法取得使用者資訊，請稍後再試。';
  }
});
}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // 按下「編輯」按鈕
  enterEdit() {
      this.userForm.patchValue({
    username:  this.user.name,
    userEmail: this.user.email,
    company:   this.user.company,
    dep:       this.user.dep
  });
  this.isEditing = true;
  }

  // 按下「取消」按鈕
  cancelEdit() {
  this.userForm.reset();
  this.previewPicUrl = this.user.pic;
  this.selectedFile = null;
  this.isEditing = false;
  }

  // 當使用者透過檔案選擇器選擇新大頭照
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    // 只接受圖片格式
    if (!file.type.startsWith('image/')) {
      this.errorMsg = '請選擇圖片檔案';
      return;
    }

    this.selectedFile = file;

    // 用 FileReader 讀取檔案，並把結果當作 Data URL 顯示成預覽
    const reader = new FileReader();
    reader.onload = () => {
      this.previewPicUrl = reader.result as string; // base64 格式
    };
    reader.readAsDataURL(file);
  }

  // 按下「儲存」按鈕時，包含文字欄位＋大頭照一起上傳
  onSubmit() {
    if (this.userForm.invalid) {
    return;
  }

  // 讀出剛才 patch 進去的值
  const formValues = this.userForm.value;

  const formData = new FormData();
  formData.append('Username',  formValues.username);   // DTO.Username
  formData.append('UserEmail', formValues.userEmail);  // DTO.UserEmail
  formData.append('Department', formValues.dep);        // DTO.Department

  // company 如果後端沒處理就不傳

  // 如果使用者選了新照片，就把檔案放到 'PhotoFile'
  if (this.selectedFile) {
    formData.append('PhotoFile', this.selectedFile, this.selectedFile.name);
  }

  // 呼叫 service
  this.userService.editUserInfo(formData).subscribe({
    next: (res) => {
      if (res.success && res.data) {
        const payload = res.data;
        // 1. 更新 localStorage 的 JWT
        localStorage.setItem('access_token', payload.newAccessToken);

        // 2. 更新畫面上的 this.user
        this.user = {
          ...this.user,
          name:  payload.userInfo.username,
          email: payload.userInfo.email,
          dep:   payload.userInfo.depName,
          pic:   payload.userInfo.photoUrl  // 完整 URL
        };

        // 3. 重新顯示預覽
        this.previewPicUrl = payload.userInfo.photoUrl;
        this.isEditing = false;
        this.selectedFile = null;
        this.errorMsg = null;
      } else {
        this.errorMsg = res.message || '更新失敗';
      }
    },
    error: (err) => {
      console.error('更新使用者資訊失敗：', err);
      this.errorMsg = '更新失敗，請稍後再試。';
    }
  });
  }
}
