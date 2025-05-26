import { Component, OnInit } from '@angular/core';
import { empDTO } from "../../Interface/empDTO";
import { EmpService } from "../../services/emp.service/emp.service";
import { Router } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-emp-manage',
  templateUrl: './emp-manage.component.html',
  styleUrls: ['./emp-manage.component.css']
})
export class EmpManageComponent implements OnInit {
  empList: empDTO[] = [];              // 🔹 顯示在表格上的當前資料（每頁10筆）
  totalRecords: number = 0;            // 🔹 總筆數（提供給 p-table 使用）
  loading: boolean = false;           // 🔹 是否在載入中（顯示 spinner）
  first: number = 0;                   // 🔹 當前頁起始 index（例如第2頁就是10）


  selectEmp!: empDTO;                 // 🔹 表格選中的那筆員工資料

  constructor(
    private empService: EmpService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.totalRecords = 30; // 🔧 這裡手動寫死，未來串接 API 應從後端取得
    this.loading = true;

    // 🔹 初始載入前10筆
    setTimeout(() => {
      this.loadLazyData({ first: 0, rows: 10 });
    }, 100);
  }

  /**
   * ✅ 處理 Lazy loading 的核心邏輯
   * @param event 包含 first（起始索引）、rows（每頁筆數）
   */
  loadLazyData(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;

    this.loading = true;
    this.first = first;

    this.empService.getPaged(first, rows).subscribe((data: empDTO[]) => {
      this.empList = data.map(emp => ({
        ...emp,
        statusLabel: emp.isEmailConfirmed ? '已驗證' : '未驗證'
      }));
      this.loading = false;
    });
  }

  /**
   * ✅ 欄位搜尋處理邏輯
   */
  onInputFilter(event: Event, field: string, dt: any): void {
    const input = event.target as HTMLInputElement;
    dt.filter(input.value, field, 'contains');
  }

  getFilterValue(filter: any): string {
    if (Array.isArray(filter)) {
      return filter[0]?.value ?? '';
    }
    return filter?.value ?? '';
  }

  /**
   * ✅ 點選某一列員工後，導向詳細頁
   */
  onRowSelect(event: any): void {
    const selectedEmployee: empDTO = event.data;
    console.log('你點了：', selectedEmployee);

    this.router.navigate(['/back-system/emp-detail', selectedEmployee.userID]);
  }
}
