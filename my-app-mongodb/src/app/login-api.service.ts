import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginApiService {
  // 👉 Nên khai báo URL base để dễ quản lý khi thay đổi
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Gửi yêu cầu đăng nhập tới API
   */
  login(EmployeeEmail: string, EmployeePassword: string): Observable<any> {
    const payload = { EmployeeEmail, EmployeePassword };

    // Có thể thêm headers nếu cần (ví dụ Content-Type hoặc token sau này)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/loginAdmin`, payload, { headers });
  }
}
