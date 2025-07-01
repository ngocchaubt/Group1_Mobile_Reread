import { Component, OnInit } from '@angular/core';
import { EventApiService } from '../../event-api.service';
import { Color, colorSets } from '@swimlane/ngx-charts'; 
import { Chart } from 'chart.js';

interface MyEvent {
  EventID: string;
  EventName: string;
  EventType: string;
  EventStart: string;
  EventEnd: string;
  EventDesc: string[];
  EventLoc: string;   
  EventCpct: number;
  Img: string;
}

@Component({
  selector: 'app-event-chart',
  standalone: false,
  templateUrl: './event-chart.component.html',
  styleUrls: ['./event-chart.component.css'] // Đã sửa từ styleUrl thành styleUrls
})
export class EventChartComponent implements OnInit {
  public eventTypeData: any[] = []; // Dữ liệu cho biểu đồ Pie Chart
  public eventMonthlyData: { [key: string]: number } = {}; // Dữ liệu cho biểu đồ đường
  private allEvents: MyEvent[] = []; // Mảng lưu trữ tất cả các sự kiện

  colorScheme: Color = colorSets.find(s => s.name === 'vivid') || colorSets[0];
  private lineChart: Chart | undefined;

  constructor(private eventApiService: EventApiService) {}

  ngOnInit() {
    this.loadAllEventData();
  }

  loadAllEventData(): void {
    const pageSize = 10; // Bạn có thể thay đổi số lượng sự kiện trên mỗi trang
    let page = 1;

    const loadPageData = () => {
      this.eventApiService.getEvent(page, pageSize).subscribe({
        next: (response) => {
          console.log('API Response:', response);

          // Thêm dữ liệu sự kiện vào mảng allEvents
          this.allEvents = [...this.allEvents, ...response.data];

          // Kiểm tra xem có trang tiếp theo không
          if (response.data.length === pageSize) {
            page++;
            loadPageData(); // Lấy dữ liệu trang tiếp theo
          } else {
            // Khi đã lấy hết dữ liệu
            this.processEventData();
          }
        },
        error: (error) => {
          console.error('Error loading event data:', error);
        }
      });
    };

    // Bắt đầu tải dữ liệu từ trang 1
    loadPageData();
  }

  processEventData(): void {
    const eventTypes = this.allEvents.map((event: MyEvent) => event.EventType);
    const eventTypeCount = this.countEventTypes(eventTypes);
    this.eventTypeData = Object.keys(eventTypeCount).map((key) => ({
      name: key,
      value: eventTypeCount[key]
    }));

    // Dữ liệu cho biểu đồ đường
    this.eventMonthlyData = this.countEventsByMonth(this.allEvents);

    // Tạo biểu đồ đường
    this.createLineChart();
  }

  countEventTypes(eventTypes: string[]): { [key: string]: number } {
    const countMap: { [key: string]: number } = {};
    eventTypes.forEach((eventType) => {
      countMap[eventType] = (countMap[eventType] || 0) + 1;
    });
    return countMap;
  }

  countEventsByMonth(events: MyEvent[]): { [key: string]: number } {
    const monthCount: { [key: string]: number } = {};
    events.forEach(event => {
      const month = new Date(event.EventStart).toLocaleString('default', { month: 'long', year: 'numeric' });
      monthCount[month] = (monthCount[month] || 0) + 1;
    });
    return monthCount;
  }

  createLineChart(): void {
    const months = Object.keys(this.eventMonthlyData);
    const counts = Object.values(this.eventMonthlyData);

    // Nếu biểu đồ đã tồn tại, hãy xóa nó trước khi tạo biểu đồ mới
    if (this.lineChart) {
      this.lineChart.destroy();
    }

    this.lineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Number of Events',
          data: counts,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Events per Month',
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Months',
              color: 'black'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Events',
              color: 'black'
            }
          }
        }
      }
    });
  }
}