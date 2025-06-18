// src/app/back-system/emp-manage/emp-manage.component.ts
// （以下略微示意，實際可保留你原本貼的那份不動）

import { Component, OnInit, ViewChild } from '@angular/core';
import { empDTO } from '../../Interface/empDTO';
import { EmpService } from '../../services/emp.service/emp.service';
import { Router } from '@angular/router';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeesListDto } from 'src/app/Interface/employeesListDTO';
import { RegisteremployeeDTO } from 'src/app/Interface/RegisteremployeeDTO';

@Component({
  selector: 'app-emp-manage',
  templateUrl: './emp-manage.component.html',
  styleUrls: ['./emp-manage.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class EmpManageComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;
  empList: EmployeesListDto[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  first: number = 0;
  rows = 10;

  currentEmp!: EmployeesListDto;
  selectedEmps: EmployeesListDto[] = [];

  displayEmpDialog: boolean = false;
  isCreateMode: boolean = true;


  constructor(
    private empService: EmpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.currentEmp = this.emptyEmployee();
  }

  ngAfterViewInit() {
    this.dt1.clearState();      // 清掉所有儲存的狀態
    this.dt1.reset();           // 觸發一次 loadLazyData({ first:0, rows:this.rows, … })
  }

  loadLazyData(event: TableLazyLoadEvent) {
    this.loading = true;
    this.first = event.first ?? 0;
    const pageSize = event.rows ?? this.rows;
    const sortFieldValue: string = Array.isArray(event.sortField)
    ? (event.sortField[0] ?? '')    // 如果是陣列就取第一個，沒值就空字串
    : (event.sortField ?? '');

    // 2. 處理 sortOrder：這邊如果你的 API 接受 null，就保留 null，否則給預設值（例如 1 或 0）
    const sortOrderValue: number | null = event.sortOrder ?? 1;

    this.empService
      .getPagedResult(
        this.first,
        pageSize,
        sortFieldValue,
        sortOrderValue,
        event.filters ?? {}
      )
      .subscribe({
        next: ({ data, total }) => {
          this.empList = data.map(employee => ({
            ...employee,
          }));
          this.totalRecords = total;
          this.loading = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: '錯誤', detail: '取得客戶列表失敗' });
          this.loading = false;
        }
      });
  }

  onInputFilter(event: Event, field: string, dt: any): void {
    const input = (event.target as HTMLInputElement).value;
    dt.filter(input, field, 'contains');
  }

  getFilterValue(filter: any): string {
    if (Array.isArray(filter)) {
      return filter[0]?.value ?? '';
    }
    return filter?.value ?? '';
  }

  emptyEmployee(): EmployeesListDto {
    return {
      userId: 0,
      /** 使用者名稱 */
      username: '',
      /** 電子郵件 */
      email: '',
      /** 部門 */
      userDep: '',
      /** 帳號狀態 */
      userStatus: '',
    };
  }

  showCreateDialog(): void {
    this.isCreateMode = true;
    this.currentEmp = this.emptyEmployee();
    this.displayEmpDialog = true;
  }

  showEditDialog(emp: EmployeesListDto): void {
    this.isCreateMode = false;
    this.currentEmp = { ...emp };
    this.displayEmpDialog = true;
  }

  onDialogHide(): void {
    this.currentEmp = this.emptyEmployee();
  }

  saveEmployee(): void {
    if (!this.currentEmp.username || !this.currentEmp.email) {
          return;
        }

        const payload: RegisteremployeeDTO = {
          username: this.currentEmp.username,
          email: this.currentEmp.email,
          depName: this.currentEmp.userDep
        };

        const obs = this.isCreateMode
          ? this.empService.createEmployee(payload)
          : this.empService.updateEmployee(this.currentEmp); // ← update 另處理


        obs.subscribe({
          next: () => {
            const action = this.isCreateMode ? '新增' : '更新';
            this.messageService.add({ severity: 'success', summary: '成功', detail: `客戶${action}成功` });
            this.displayEmpDialog = false;
            this.loadLazyData({ first: this.isCreateMode ? 0 : this.first, rows: this.rows });
          },
          error: (err) => {
            const action = this.isCreateMode ? '新增' : '更新';
            const errorMsg = err.error?.message ?? `客戶${action}失敗`;
            this.messageService.add({ severity: 'error', summary: '失敗', detail: errorMsg });
          }
        });
      }

  confirmDelete(emp: EmployeesListDto): void {
  this.confirmationService.confirm({
    message: `您確定要停用 ${emp.username} 嗎？`,
    accept: () => {
      this.empService.deactivate(emp.userId).subscribe(success => {
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: '停用成功',
            detail: `${emp.username} 已被停用`
          });
          // 重新拉分頁資料
          this.loadLazyData({ first: this.first, rows: this.rows } as TableLazyLoadEvent);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '停用失敗',
            detail: `無法停用 ${emp.username}`
          });
        }
      });
    }
  });
}

confirmDeleteSelected(): void {
  if (!this.selectedEmps.length) return;

  this.confirmationService.confirm({
    message: `確定停用已選取的 ${this.selectedEmps.length} 筆資料？`,
    accept: () => {
      const ids = this.selectedEmps.map(c => c.userId);
      this.empService.deactivate(ids).subscribe(success => {
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: '批次停用成功',
            detail: `${this.selectedEmps.length} 筆資料已停用`
          });
          // 清空選取、重載資料
          this.selectedEmps = [];
          this.loadLazyData({ first: this.first, rows: this.rows } as TableLazyLoadEvent);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: '批次停用失敗',
            detail: `請稍後再試`
          });
        }
      });
    }
  });
}

    editEmployee(com: EmployeesListDto) {
      this.currentEmp = { ...com };
      this.isCreateMode = false;      // 進入編輯模式
      this.displayEmpDialog = true;   // 顯示對話框
    }
}
