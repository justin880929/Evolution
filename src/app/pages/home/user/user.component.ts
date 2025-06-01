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
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      dep: [''],
      // 可以額外在 form 裡加一個「pic」欄位，讓 onSubmit 讀到
      pic: [''],
    });

    // 2. 拿課程列表
    this.courseService.getCourses().subscribe((data) => {
      this.courses = data;
    });

    // 3. 拿使用者資訊後，把它 patch 到 form，也存到 this.user
    this.sub = this.userService.getUserInfo().subscribe({
      next: (data: UserDTO) => {
        this.user = data;

        // 把 user 的資料灌到 Form 裡（包括 pic URL）
        this.userForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          company: this.user.company,
          dep: this.user.dep,
          pic: this.user.pic,
        });
      },
      error: (err) => {
        console.error('取得使用者資訊失敗：', err);
        this.errorMsg = '無法取得使用者資訊，請稍後再試。';
      },
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // 按下「編輯」按鈕
  enterEdit() {
    this.isEditing = true;
    // 確保 form 裡的值與 this.user 同步
    this.userForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      company: this.user.company,
      dep: this.user.dep,
      pic: this.user.pic,
    });
  }

  // 按下「取消」按鈕
  cancelEdit() {
    // 清除選到的檔案、預覽
    this.selectedFile = null;
    this.previewPicUrl = null;

    // 把 form 還原為 this.user 的舊值
    this.userForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      company: this.user.company,
      dep: this.user.dep,
      pic: this.user.pic,
    });
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

    // 先把 form 裡的文字欄位值讀出來
    const formValues = this.userForm.value;

    // 如果有挑選新大頭照，就用 FormData 才能傳檔案
    if (this.selectedFile) {
      const formData = new FormData();
      // 將文字欄位加入 FormData
      formData.append('name', formValues.name);
      formData.append('email', formValues.email);
      formData.append('company', formValues.company);
      formData.append('dep', formValues.dep);
      // 再加入檔案
      formData.append('avatar', this.selectedFile, this.selectedFile.name);

      // 呼叫 userService.updateUserWithAvatar(formData)
      this.userService.updateUserWithAvatar(formData).subscribe({
        next: (res: UserDTO) => {
          // 假設後端回傳的是新的 user 物件，包含更新後的 avatar URL
          this.user = res;
          // 重置表單與狀態
          this.selectedFile = null;
          this.previewPicUrl = null;
          this.isEditing = false;
        },
        error: (err) => {
          console.error('更新使用者含大頭照失敗：', err);
          this.errorMsg = '更新失敗，請稍後再試。';
        },
      });
    } else {
      // 如果沒有選照片，就像之前一樣只更新文字欄位
      const updated: UserDTO = {
        ...this.user,
        name: formValues.name,
        email: formValues.email,
        company: formValues.company,
        dep: formValues.dep,
        pic: this.user.pic, // 保持原本 pic URL
      };

      this.userService.updateUser(updated).subscribe({
        next: (res) => {
          this.user = res;
          this.isEditing = false;
        },
        error: (err) => {
          console.error('更新使用者資訊失敗：', err);
          this.errorMsg = '更新失敗，請稍後再試。';
        },
      });
    }
  }
}
