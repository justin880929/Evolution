import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CompanyListDTO } from 'src/app/Interface/companyListDTO';
import { ClientService } from './../../services/client.service';
import { RegisterCompanyDTO } from 'src/app/Interface/RegisterCompanyDTO ';



@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;
  clientList: CompanyListDTO[] = [];
  totalRecords = 0;
  loading = false;
  first = 0;
  rows = 10;

  currentCom!: CompanyListDTO;
  selectedComs: CompanyListDTO[] = [];
  displayComDialog = false;
  isCreateMode = true;

  constructor(
    private clientService: ClientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.currentCom = this.emptyCompany();
  }

  ngAfterViewInit() {
    this.dt1.clearState();      // 清掉所有儲存的狀態
    this.dt1.reset();           // 觸發一次 loadLazyData({ first:0, rows:this.rows, … })
  }

  // 分頁載入
  loadLazyData(event: TableLazyLoadEvent) {
    this.loading = true;
    this.first = event.first ?? 0;
    const pageSize = event.rows ?? this.rows;
    // 1. 處理 sortField：如果是陣列就取第一個，否則直接取字串／null
    const sortFieldValue: string | null = Array.isArray(event.sortField)
      ? (event.sortField[0] ?? null)
      : (event.sortField ?? null);

    // 2. 處理 sortOrder：這邊如果你的 API 接受 null，就保留 null，否則給預設值（例如 1 或 0）
    const sortOrderValue: number | null = event.sortOrder ?? null;

    this.clientService
      .getClientPageData(
        this.first,
        pageSize,
        sortFieldValue,
        sortOrderValue,
        event.filters ?? {}
      )
      .subscribe({
        next: ({ data, total }) => {
          this.clientList = data.map(client => ({
            ...client,
            isActiveLabel: client.isActive ? '啟用' : '停用'
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


  // === 1. 顯示「新增客戶」對話框 ===
  createClient(): void {
    this.isCreateMode = true;
    this.currentCom = this.emptyCompany();
    this.displayComDialog = true;
  }

  // === 2. 顯示「編輯客戶」對話框 ===
  updateClient(com: CompanyListDTO): void {
    this.isCreateMode = false;
    this.currentCom = { ...com };
    this.displayComDialog = true;
  }

  // === 3. 實際呼叫 API 建立/編輯 ===
  saveClient(): void {
    if (!this.currentCom.companyName || !this.currentCom.companyEmail) {
      return;
    }

    const payload: RegisterCompanyDTO = {
      companyName: this.currentCom.companyName,
      email: this.currentCom.companyEmail,
      isActive: this.currentCom.isActive ?? true,  // 預設為啟用
    };

    const obs = this.isCreateMode
      ? this.clientService.createClient(payload)
      : this.clientService.updateClient(this.currentCom); // ← update 另處理


    obs.subscribe({
      next: () => {
        const action = this.isCreateMode ? '新增' : '更新';
        this.messageService.add({ severity: 'success', summary: '成功', detail: `客戶${action}成功` });
        this.displayComDialog = false;
        this.loadLazyData({ first: this.isCreateMode ? 0 : this.first, rows: this.rows });
      },
      error: (err) => {
        const action = this.isCreateMode ? '新增' : '更新';
        const errorMsg = err.error?.message ?? `客戶${action}失敗`;
        this.messageService.add({ severity: 'error', summary: '失敗', detail: errorMsg });
      }
    });
  }

  // === 4. 刪除單一客戶 ===
  deleteClient(com: CompanyListDTO): void {
    this.confirmationService.confirm({
      message: `確定刪除 ${com.companyName}？`,
      accept: () => {
        this.clientService.deleteClient(com.companyId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: '刪除成功', detail: `${com.companyName} 已刪除` });
            this.loadLazyData({ first: this.first, rows: this.rows } as any);
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: '失敗', detail: '刪除客戶失敗' });
          }
        });
      }
    });
  }

  // === 5. 批次刪除 ===
  deleteClientsBulk(): void {
    if (!this.selectedComs.length) return;
    this.confirmationService.confirm({
      message: `確定刪除已選取的 ${this.selectedComs.length} 筆資料？`,
      accept: () => {
        const ids = this.selectedComs.map(c => c.companyId);
        this.clientService.deleteClientsBulk(ids).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: '刪除成功', detail: `${this.selectedComs.length} 筆資料已刪除` });
            this.selectedComs = [];
            this.loadLazyData({ first: this.first, rows: this.rows } as any);
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: '失敗', detail: '批次刪除失敗' });
          }
        });
      }
    });
  }

  // Utility：清空一個空公司物件
  emptyCompany(): CompanyListDTO {
    return {
      companyId: 0,
      companyName: '',
      companyEmail: '',
      isActive: false,
      createdAt: new Date().toISOString()   // 或直接 '' 也行，但用 ISO 字串比較安全
    };
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

  onDialogHide(): void {
    this.currentCom = this.emptyCompany();
  }

  /** 編輯客戶：打開編輯對話框或導向編輯頁面 */
  editClient(com: CompanyListDTO) {
    this.currentCom = { ...com };
    this.isCreateMode = false;      // 進入編輯模式
    this.displayComDialog = true;   // 顯示對話框
  }

  getNewClient(){
    this.currentCom.companyName = '米月偷偷股份有限公司';
    this.currentCom.companyEmail = 'tommyispan@gmail.com';
  }
}
