import { Component, OnInit } from '@angular/core';
import { empDTO } from '../../Interface/empDTO';
import { EmpService } from '../../services/emp.service/emp.service';
import { Router } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-emp-permissions',
  templateUrl: './emp-permissions.component.html',
  styleUrls: ['./emp-permissions.component.css'],
})
export class EmpPermissionsComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
//   empList: empDTO[] = [];
//   totalRecords: number = 0;
//   loading: boolean = false;
//   first: number = 0;

//   selectEmp!: empDTO;
//   selectedEmps: empDTO[] = [];

//   displayEmpDialog: boolean = false;
//   isCreateMode: boolean = true;
//   currentEmp: empDTO = {
//     userID: 0,
//     username: '',
//     email: '',
//     department: '',
//     isEmailConfirmed: false,
//   };

//   constructor(
//     private empService: EmpService,
//     private router: Router,
//     private confirmationService: ConfirmationService,
//     private messageService: MessageService
//   ) { }

//   ngOnInit(): void {
//     this.loading = true;
//     setTimeout(() => this.loadLazyData({ first: 0, rows: 10 }), 100);
//   }

//   loadLazyData(event: TableLazyLoadEvent): void {
//     const first = event.first ?? 0;
//     const rows = event.rows ?? 10;
//     let sortFieldRaw = event.sortField;
//     const sortField: string = Array.isArray(sortFieldRaw) ? sortFieldRaw[0] ?? '' : sortFieldRaw ?? '';
//     const sortOrder = event.sortOrder ?? 1;
//     const filters = event.filters ?? {};

//     this.loading = true;
//     this.first = first;

//     // this.empService
//     //   .getPagedResult(first, rows, sortField, sortOrder, filters)
//     //   .subscribe({
//     //     next: res => {
//     //       this.empList = res.data.map(emp => ({
//     //         ...emp,
//     //         statusLabel: emp.isEmailConfirmed ? '已授權' : '未授權'
//     //       }));
//     //       this.totalRecords = res.total;
//     //       this.loading = false;
//     //     },
//     //     error: () => {
//     //       this.messageService.add({ severity: 'error', summary: '錯誤', detail: '取得員工列表失敗' });
//     //       this.loading = false;
//     //     }
//     //   });
//   }

//   onInputFilter(event: Event, field: string, dt: any): void {
//     const input = (event.target as HTMLInputElement).value;
//     dt.filter(input, field, 'contains');
//   }

//   getFilterValue(filter: any): string {
//     if (Array.isArray(filter)) {
//       return filter[0]?.value ?? '';
//     }
//     return filter?.value ?? '';
//   }

//   emptyEmployee(): empDTO {
//     return { userID: 0, username: '', email: '', department: '', isEmailConfirmed: false, statusLabel: '未驗證' } as empDTO;
//   }

//   showCreateDialog(): void {
//     this.isCreateMode = true;
//     this.currentEmp = this.emptyEmployee();
//     this.displayEmpDialog = true;
//   }

//   showEditDialog(emp: empDTO): void {
//     this.isCreateMode = false;
//     this.currentEmp = { ...emp };
//     this.displayEmpDialog = true;
//   }

//   onDialogHide(): void {
//     this.currentEmp = this.emptyEmployee();
//   }

//   saveEmployee(): void {
//     if (!this.currentEmp.username || !this.currentEmp.email) return;

//     if (this.isCreateMode) {
//       this.empService.createEmployee(this.currentEmp).subscribe({
//         next: () => {
//           this.messageService.add({ severity: 'success', summary: '成功', detail: '員工新增成功' });
//           this.displayEmpDialog = false;
//           this.first = 0;
//           this.loadLazyData({ first: 0, rows: 10 } as TableLazyLoadEvent);
//         },
//         error: () => {
//           this.messageService.add({ severity: 'error', summary: '錯誤', detail: '新增員工失敗' });
//         }
//       });
//     } else {
//       this.empService.updateEmployee(this.currentEmp).subscribe({
//         next: () => {
//           this.messageService.add({ severity: 'success', summary: '成功', detail: '員工更新成功' });
//           this.displayEmpDialog = false;
//           this.loadLazyData({ first: this.first, rows: 10 } as TableLazyLoadEvent);
//         },
//         error: () => {
//           this.messageService.add({ severity: 'error', summary: '錯誤', detail: '更新員工失敗' });
//         }
//       });
//     }
//   }

//   confirmDelete(emp: empDTO): void {
//     this.confirmationService.confirm({
//       message: `您確定要刪除 ${emp.username} 嗎？`,
//       accept: () => {
//         this.empService.deleteEmployee(emp.userID).subscribe({
//           next: () => {
//             this.messageService.add({ severity: 'success', summary: '刪除成功', detail: `${emp.username} 已被刪除` });
//             this.loadLazyData({ first: this.first, rows: 10 } as TableLazyLoadEvent);
//           },
//           error: () => {
//             this.messageService.add({ severity: 'error', summary: '錯誤', detail: '刪除員工失敗' });
//           }
//         });
//       }
//     });
//   }

//   confirmDeleteSelected(): void {
//     if (!this.selectedEmps || this.selectedEmps.length === 0) return;

//     this.confirmationService.confirm({
//       message: `您確定要刪除已勾選的 ${this.selectedEmps.length} 位員工嗎？`,
//       accept: () => {
//         const idsToDelete = this.selectedEmps.map(e => e.userID);
//         this.empService.deleteEmployeesBulk(idsToDelete).subscribe({
//           next: () => {
//             this.messageService.add({ severity: 'success', summary: '批次刪除成功', detail: `${this.selectedEmps.length} 位員工已被刪除` });
//             this.selectedEmps = [];
//             this.loadLazyData({ first: this.first, rows: 10 } as TableLazyLoadEvent);
//           },
//           error: () => {
//             this.messageService.add({ severity: 'error', summary: '錯誤', detail: '批次刪除失敗' });
//           }
//         });
//       }
//     });
//   }
// }
