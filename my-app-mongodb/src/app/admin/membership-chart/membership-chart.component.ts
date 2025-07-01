import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MembershipApiService } from '../../membership-api.service';
import { colorSets, Color } from '@swimlane/ngx-charts';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-membership-chart',
  standalone: false,
  templateUrl: './membership-chart.component.html',
  styleUrl: './membership-chart.component.css'
})
export class MembershipChartComponent implements OnInit {
  @ViewChild('membershipChart', { static: true }) chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  constructor(private membershipService: MembershipApiService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.fetchMembershipData();
  }

  fetchMembershipData(): void {
    this.membershipService.getMembership(1, 10).subscribe({
      next: (response) => {
        const filteredData = response.data
          .filter(item => typeof item.MinimumPaid === 'number')
          .sort((a, b) => a.MinimumPaid - b.MinimumPaid);

        const labels = filteredData.map(item => item.MbsType);
        const values = filteredData.map(item => item.MinimumPaid);

        // Tạo danh sách màu ngẫu nhiên cho từng MbsType
        const backgroundColors = labels.map(() => this.getRandomColor());

        this.renderChart(labels, values, backgroundColors);
      },
      error: (err) => console.error('Lỗi API:', err)
    });
  }

  renderChart(labels: string[], values: number[], backgroundColors: string[]): void {
    if (this.chart) {
      this.chart.destroy(); // Hủy biểu đồ cũ nếu có
    }

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'MinimumPaid',
          data: values,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.6', '1')), // Tăng độ đậm
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Cho phép thay đổi kích thước tự do
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  getRandomColor(): string {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  }
}

