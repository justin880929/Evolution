import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CourseAccessServiceService } from 'src/app/services/CourseAccess/course-access.service.service';
import { EmployeeAccessView } from 'src/app/Interface/CourseListDTO';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit, OnDestroy {


  courseId!: number;

  departments: { id: number; name: string }[] = [];
  selectedDepartment: any = null;
  globalFilter: string = '';
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  @ViewChild('dt') dt!: any; // 或 p-table 的正確型別
  allEmployees: EmployeeAccessView[] = [];
  filteredEmployees: EmployeeAccessView[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private service: CourseAccessServiceService
  ) { }

  ngOnInit(): void {
    this.courseId = this.config.data.courseId;
    console.log('接收到的 CourseID:', this.courseId);

    this.loadDepartments();
    this.loadEmployeesWithAccess(this.courseId);
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe(value => {
        this.dt.filterGlobal(value, 'contains');
      });
  }
  onGlobalFilterInput(value: string) {
    this.searchSubject.next(value);
  }
  // 載入部門清單
  loadDepartments() {
    this.service.getDepList().subscribe(res => {
      this.departments = res.map((dep: any) => ({
        id: dep.depId,
        name: dep.depName
      }));
    });
  }

  // 載入員工資料（含權限狀態）
  loadEmployeesWithAccess(courseId: number) {
    forkJoin({
      employees: this.service.getAllEmployeeWithAccess(courseId),
      accesses: this.service.getCourseAccess(courseId),
      departments: this.service.getDepList()
    }).pipe(
      map(({ employees, accesses, departments }) => {
        console.log(accesses);

        const accessMap = new Map<number, number>();
        const flatAccesses = (accesses || []).flat();
        flatAccesses.forEach((access: any) => {
          accessMap.set(access.userId, access.courseAccessId);
        });

        return (employees || []).map((emp: any) => {
          const dep = departments.find((d: any) => d.depId === emp.depId);
          return {
            userId: emp.userId,
            username: emp.userName,
            email: emp.userEmail,
            userDep: dep ? dep.depName : '未知部門',
            hasAccess: accessMap.has(emp.userId),
            courseAccessId: accessMap.get(emp.userId)
          };
        });
      })
    ).subscribe(data => {
      this.allEmployees = data;
      this.filteredEmployees = [...this.allEmployees];
      console.log(this.allEmployees);

    });
  }




  // 勾選或取消勾選權限
  onCheckboxChange(emp: EmployeeAccessView, isChecked: boolean) {
    if (isChecked) {
      this.service.postUserCourseAccess(this.courseId, emp.userId).subscribe(res => {
        emp.courseAccessId = res; // 後端回傳新建立的權限 ID
        emp.hasAccess = true;
      });

    } else {
      if (emp.courseAccessId) {
        this.service.delUserCourseAccess(emp.courseAccessId).subscribe(() => {
          emp.hasAccess = false;
          emp.courseAccessId = undefined;
        });
      }
    }
  }

  // 依部門篩選
  filterByDepartment() {
    if (this.selectedDepartment) {
      this.filteredEmployees = this.allEmployees.filter(
        e => e.userDep === this.selectedDepartment.name
      );
    } else {
      this.filteredEmployees = [...this.allEmployees];
    }
  }

  // 清除所有篩選條件
  clearFilters() {
    this.selectedDepartment = null;
    this.globalFilter = '';
    this.filteredEmployees = [...this.allEmployees];
  }

  // 關閉對話框
  close() {
    this.ref.close();
  }
  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
}
