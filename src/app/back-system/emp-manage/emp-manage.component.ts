import { Component, OnInit } from '@angular/core';
import { empDTO } from "../../Interface/empDTO";
import { EmpService } from "../../services/emp.service/emp.service";
@Component({
  selector: 'app-emp-manage',
  templateUrl: './emp-manage.component.html',
  styleUrls: ['./emp-manage.component.css']
})
export class EmpManageComponent implements OnInit {
  empList: empDTO[] = [];
  selectEmp!: empDTO;

  constructor(private empService: EmpService) {}

  ngOnInit(): void {
    this.empService.getAll().subscribe((data) => {
      this.empList = data;
    });
  }

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

  onRowSelect(event: any): void {
  const selectedEmployee: empDTO = event.data;
  console.log('你點了：', selectedEmployee);

  // 你可以這裡跳轉詳細頁
  // this.router.navigate(['/back-system/emp-detail', selectedEmployee.id]);

  // 或彈出 dialog 編輯畫面
}

}
