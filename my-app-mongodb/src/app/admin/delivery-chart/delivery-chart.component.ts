import { Component, OnInit } from '@angular/core';
import { DeliveryApiService } from '../../delivery-api.service';
import { Color, colorSets } from '@swimlane/ngx-charts'; 

@Component({
  selector: 'app-delivery-chart',
  standalone: false,
  templateUrl: './delivery-chart.component.html',
  styleUrl: './delivery-chart.component.css'
})
export class DeliveryChartComponent implements OnInit {
  deliveryData: any[] = []; // Dữ liệu Pie Chart
  lineChartData: any[] = []; // Dữ liệu Line Chart
  view: [number, number] = [500, 250]; // Kích thước biểu đồ

  colorScheme: Color = colorSets.find(s => s.name === 'vivid') || colorSets[0];

  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private deliveryService: DeliveryApiService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.deliveryService.getDelivery(this.currentPage, 100).subscribe({
      next: response => {
        console.log('📊 Dữ liệu API:', response);
        
        if (response?.data?.length) {
          this.processData(response.data);
          this.processLineChartData(response.data);
        } else {
          console.warn('⚠ Không có dữ liệu đơn hàng.');
        }

        this.totalPages = response.total || 1;
        this.currentPage++;

        if (this.currentPage <= this.totalPages) {
          this.fetchData();
        } else {
          console.log('📊 Đã tải hết dữ liệu');
        }
      },
      error: err => console.error('❌ Lỗi khi tải dữ liệu:', err)
    });
  }

  processData(data: any[]): void {
    const carrierCount: { [key: string]: number } = {};
    data.forEach(order => {
      const carrier = order.CarrierName?.trim() || 'Không xác định';
      carrierCount[carrier] = (carrierCount[carrier] || 0) + 1;
    });

    this.deliveryData = Object.keys(carrierCount).map(key => ({
      name: key,
      value: carrierCount[key]
    }));
  }

  processLineChartData(data: any[]): void {
    const lineData: { [key: string]: { estimated: number[], actual: number[] } } = {};

    data.forEach(order => {
      if (!order.EstimatedDeliveryDate || !order.ActualDeliveryDate || !order.Address) return;

      // Lấy địa điểm (TP.HCM, Hà Nội, ...)
      const addressParts = order.Address.split(',');
      const location = addressParts[addressParts.length - 1]?.trim() || 'Không xác định';

      // Chuyển đổi định dạng ngày "dd/MM/yyyy" thành timestamp
      const estimatedTimestamp = this.convertDateToTimestamp(order.EstimatedDeliveryDate);
      const actualTimestamp = this.convertDateToTimestamp(order.ActualDeliveryDate);

      if (!lineData[location]) {
        lineData[location] = { estimated: [], actual: [] };
      }

      lineData[location].estimated.push(estimatedTimestamp);
      lineData[location].actual.push(actualTimestamp);
    });

    this.lineChartData = [
      {
        name: 'Estimated Delivery Date',
        series: Object.keys(lineData).map(location => ({
          name: location,
          value: this.calculateAverage(lineData[location].estimated)
        })).sort((a, b) => a.value - b.value)
      },
      {
        name: 'Actual Delivery Date',
        series: Object.keys(lineData).map(location => ({
          name: location,
          value: this.calculateAverage(lineData[location].actual)
        })).sort((a, b) => a.value - b.value)
      }
    ];

    console.log('📊 Dữ liệu Line Chart:', this.lineChartData);
  }

  convertDateToTimestamp(dateString: string): number {
    const [day, month, year] = dateString.split('/').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day).getTime();
  }

  calculateAverage(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  formatLabel(data: any): string {
    return `${data.name}: ${new Date(data.value).toLocaleDateString()}`;
  }
  formatDateLabel(value: number): string {
    return new Date(value).toLocaleDateString();
  }
  
}
