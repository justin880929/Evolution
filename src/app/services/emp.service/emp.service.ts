import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { empDTO } from '../../Interface/empDTO';
import { MOCK_EMP } from '../../mock/mock-emp';

@Injectable({
  providedIn: 'root',
})
export class EmpService {
  constructor(private http: HttpClient) {}

  useMock = true;

  getData(): Observable<empDTO[]> {
    return this.useMock
      ? of(MOCK_EMP)
      : this.http.get<empDTO[]>('https://your-api/employees');
  }

  getMini(): Observable<empDTO[]> {
    return this.getData().pipe(map(data => data.slice(0, 5)));
  }

  getAll(): Observable<empDTO[]> {
  return this.getData(); // ✅ 不做 slice，回傳全部
  }

}
