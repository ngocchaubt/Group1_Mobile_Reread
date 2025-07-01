import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SaleOrderAPIService } from '../../sale-order-api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-sale-order-chart',
  standalone: false,
  templateUrl: './sale-order-chart.component.html',
  styleUrl: './sale-order-chart.component.css'
})
export class SaleOrderChartComponent implements AfterViewInit {
  @ViewChild('orderChart') orderChart!: ElementRef;
  @ViewChild('deliveryChart') deliveryChart!: ElementRef;
  @ViewChild('orderStatusChart') orderStatusChart!: ElementRef;

  chart!: Chart;
  deliveryChartInstance!: Chart;
  orderStatusChartInstance: any;
  salesData: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  constructor(private saleOrderService: SaleOrderAPIService) {}

  ngAfterViewInit() {
    this.loadAllSalesData();
  }
  loadAllSalesData() {
    // Gọi API để lấy dữ liệu từ các trang
    this.saleOrderService.getSaleOrder(this.currentPage, 300).subscribe((data) => {
      // Lưu dữ liệu vào salesData
      this.salesData = [...this.salesData, ...data.data];
      this.totalPages = data.total;  // Nếu API trả về tổng số trang
      this.currentPage++;

      // Kiểm tra nếu còn trang tiếp theo
      if (this.currentPage <= this.totalPages) {
        this.loadAllSalesData();  // Gọi tiếp trang tiếp theo
      } else {
        this.createChart();  // Sau khi lấy hết dữ liệu, tạo biểu đồ
      }
    });
  }

  createChart() {
    if (!this.orderChart || !this.orderChart.nativeElement) {
      console.error('Không tìm thấy phần tử canvas để vẽ biểu đồ.');
      return;
    }
  //theo payment method
    const paymentMethods = this.salesData.map(order => order.PaymentMethod);
    const orderTotals = this.salesData.map(order => Number(order.OrderTotal)); // Ép kiểu thành number[]
  
    const paymentSummary = paymentMethods.reduce((acc: any, method: string, index: number) => {
      acc[method] = (acc[method] || 0) + orderTotals[index];
      return acc;
    }, {});
  
    const labels = Object.keys(paymentSummary);
    const values: number[] = Object.values(paymentSummary).map(v => Number(v)); // Đảm bảo kiểu number[]
  
    this.chart = new Chart(this.orderChart.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Order Revenue by Payment Method',
          data: values,
          backgroundColor: ['blue', 'green', 'red', 'purple', 'orange'],
          borderColor: 'none',
          borderWidth: 0,
        }],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'OrderTotal by Payment Method',
            color: 'black', 
            font: { size: 14 },
          },
        },
        scales: {
          x: {
            ticks: {
              color: 'black', // Màu chữ trục X
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: 'black', // Màu chữ trục Y
            },
          },
        },
      },
    });
//theo delivery method
    const deliveryMethods = this.salesData.map(order => order.DeliveryMethod);
    const deliverySummary = deliveryMethods.reduce((acc: any, method: string, index: number) => {
      acc[method] = (acc[method] || 0) + orderTotals[index];
      return acc;
    }, {});

    const deliveryLabels = Object.keys(deliverySummary);
    const deliveryValues: number[] = Object.values(deliverySummary);
  
    this.deliveryChartInstance = new Chart<"bar", number[], string>(this.deliveryChart.nativeElement, {
      type: 'bar',
      data: {
        labels: deliveryLabels,
        datasets: [{
          label: 'OrderTotal by Delivery Method',
          data: deliveryValues,
          backgroundColor: ['cyan', 'magenta', 'yellow', 'gray', 'black'],
          borderColor: 'black',
          borderWidth: 0,
        }],
      },
      options: {
        plugins: {
          legend: {
            display: false, // Ẩn legend
          },
          title: {
            display: true,
            text: 'Total Order Revenue by Delivery Method',
            color: 'black',
            font: { size: 14 },
          },
        },
        scales: {
          x: { ticks: { color: 'black' } },
          y: { beginAtZero: true, ticks: { color: 'black' } },
        },
      },
    });
//theo order status
    const orderStatusSummary = this.aggregateData('OrderStatus');

    this.orderStatusChartInstance = new Chart<"bar", number[], string>(this.orderStatusChart.nativeElement, {
      type: 'bar',
      data: {
        labels: Object.keys(orderStatusSummary),
        datasets: [{
          label: 'Order Count by Order Status',
          data: Object.values(orderStatusSummary),
          backgroundColor: ['red', 'yellow', 'blue', 'green', 'purple'],
          borderColor: 'black',
          borderWidth: 0,
        }],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Number of Orders by Order Status (Last Month)',
            color: 'black',
            font: { size: 14 },
          },
        },
        scales: {
          x: { ticks: { color: 'black' } },
          y: { beginAtZero: true, ticks: { color: 'black' } },
        },
      }
    });
  }

  aggregateData(key: string) {
    if (!this.salesData || this.salesData.length === 0) {
      console.error("Dữ liệu salesData trống hoặc chưa được khởi tạo!");
      return {};
    }
  
    // Lọc ra những đơn hàng có ngày hợp lệ
    const validOrders = this.salesData.filter((order: any) => order.OrderDate);
  
    if (validOrders.length === 0) {
      console.warn("Không có đơn hàng hợp lệ với ngày tháng hợp lệ.");
      return {};
    }
  
    // Tìm ngày lớn nhất trong dữ liệu hợp lệ
    const maxDate = new Date(Math.max(...validOrders.map((order: any) => new Date(order.OrderDate).getTime())));
  
    // Lấy tháng và năm của ngày lớn nhất
    const latestYear = maxDate.getFullYear();
    const latestMonth = maxDate.getMonth();
  
    // Lọc dữ liệu chỉ lấy đơn hàng thuộc tháng gần nhất
    const recentSales = validOrders.filter((order: any) => {
      const orderDate = new Date(order.OrderDate);
      return orderDate.getFullYear() === latestYear && orderDate.getMonth() === latestMonth;
    });
  
    // Kiểm tra nếu không có đơn nào trong tháng gần nhất
    if (recentSales.length === 0) {
      console.warn("Không có đơn hàng nào trong tháng gần nhất!");
      return {};
    }
  
    // Nhóm và đếm theo trạng thái đơn hàng (OrderStatus)
    return recentSales.reduce((acc: any, order: any) => {
      const status = order[key];
      if (status) {
        acc[status] = (acc[status] || 0) + 1;
      }
      return acc;
    }, {});
  } 
  
}
