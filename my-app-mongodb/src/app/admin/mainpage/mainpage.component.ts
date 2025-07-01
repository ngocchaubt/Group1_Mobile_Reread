import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  standalone: false,
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent {
  EmployeeName: string | null = '';
  constructor(private router: Router) {}

  ngOnInit() {
    this.EmployeeName = localStorage.getItem('EmployeeName'); // Lấy EmployeeName từ Local Storage
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('EmployeeName'); // Xóa EmployeeName khi logout
    this.router.navigate(['/login']);
  }
}
