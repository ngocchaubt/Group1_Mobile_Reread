import { Component } from '@angular/core';
import { LoginApiService } from '../login-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false; // 👉 Thêm loading indicator

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginApiService: LoginApiService
  ) {
    this.loginForm = this.fb.group({
      EmployeeEmail: ['', [Validators.required, Validators.email]],
      EmployeePassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    const { EmployeeEmail, EmployeePassword } = this.loginForm.value;
    this.errorMessage = '';
    this.loading = true;

    console.log('📤 Login Attempt:', EmployeeEmail, EmployeePassword);

    this.loginApiService.login(EmployeeEmail.trim(), EmployeePassword.trim()).subscribe({
      next: (response) => {
        console.log('✅ API Response:', response);

        // Lưu thông tin người dùng
        localStorage.setItem('token', response.token);
        localStorage.setItem('EmployeeName', response.EmployeeName);

        // Điều hướng sang dashboard
        this.router.navigate(['/admin/order']);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ API Error:', err);
        this.loading = false;

        // Hiển thị lỗi người dùng dễ hiểu
        this.errorMessage =
          err?.error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!';
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('EmployeeName');
    this.router.navigate(['/login']);
  }
}
