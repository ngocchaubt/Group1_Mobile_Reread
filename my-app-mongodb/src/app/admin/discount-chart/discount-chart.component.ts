import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Discount } from '../../classes/Discount';
import { Chart } from 'chart.js';
import { DiscountApiService } from '../../discount-api.service';

@Component({
  selector: 'app-discount-chart',
  standalone: false,
  templateUrl: './discount-chart.component.html',
  styleUrl: './discount-chart.component.css'
})
export class DiscountChartComponent implements OnInit {
  @ViewChild('barChart', { static: true }) barChartRef!: ElementRef;
  discounts: Discount[] = [];
  chart!: Chart;
  
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private discountService: DiscountApiService) {}

  ngOnInit(): void {
    this.loadDiscountData();
  }

  loadDiscountData(): void {
    // Gọi API để tải dữ liệu phân trang
    this.discountService.getDiscount(this.currentPage, 10).subscribe({
      next: response => {
        this.discounts = [...this.discounts, ...response.data]; // Gộp dữ liệu đã tải vào mảng discounts
        
        // Cập nhật số trang
        this.totalPages = response.total || 1; // Kiểm tra nếu API có trả về tổng số trang
        this.currentPage++;

        if (this.currentPage <= this.totalPages) {
          this.loadDiscountData(); // Tiếp tục gọi lại để lấy dữ liệu từ các trang tiếp theo
        } else {
          this.createBarChart(); // Khi đã tải hết dữ liệu, tạo biểu đồ
        }
      },
      error: err => console.error('❌ Lỗi khi tải dữ liệu:', err)
    });
  }

  createBarChart(): void {
    const ctx = this.barChartRef.nativeElement.getContext('2d');

    if (this.chart) {
      this.chart.destroy(); // Xóa biểu đồ cũ nếu có
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.discounts.map(d => d.DiscountID), // Nhãn là mã giảm giá
        datasets: [
          {
            label: 'DiscUsed',
            data: this.discounts.map(d => d.DiscUsed),
            backgroundColor: 'rgba(0, 255, 76, 0.66)', // Màu đỏ
            borderColor: 'rgba(0, 255, 76, 0.66)',
            borderWidth: 1
          },
          {
            label: 'DiscLeft',
            data: this.discounts.map(d => d.DiscLeft),
            backgroundColor: 'rgba(186, 11, 116, 0.66)', // Màu xanh
            borderColor: 'rgba(186, 11, 116, 0.66)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              color: '#000' // Đổi màu chữ trục X thành đen
            }
          },
          y: {
            ticks: {
              color: '#000' // Đổi màu chữ trục Y thành đen
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#000' // Đổi màu chữ trong legend thành đen
            }
          }
        }
      }
    });
  }
}
