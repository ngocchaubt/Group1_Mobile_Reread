import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BookStockApiService } from '../../book-stock-api.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-bookstock-chart',
  standalone: false,
  templateUrl: './bookstock-chart.component.html',
  styleUrl: './bookstock-chart.component.css'
})
export class BookstockChartComponent implements OnInit, AfterViewInit {
  public barChart: any; // Biểu đồ sách theo tình trạng
  public returnedChart: any; // Biểu đồ sách đã trả lại theo tình trạng

  constructor(private bookStockApiService: BookStockApiService) { }

  ngOnInit(): void {
    this.fetchAllBookStocks();
  }

  ngAfterViewInit(): void {
    // Chart.js yêu cầu phải gọi sau khi view đã được khởi tạo
  }

  // Hàm lấy tất cả dữ liệu sách từ API, phân trang
  fetchAllBookStocks(): void {
    let currentPage = 1;
    const allBooks: any[] = []; // Mảng lưu trữ tất cả sách

    // Hàm để lấy dữ liệu của mỗi trang
    const fetchPage = (page: number) => {
      this.bookStockApiService.getBookStock(page, 10).subscribe(response => {
        allBooks.push(...response.data); // Thêm sách của trang hiện tại vào mảng allBooks

        // Kiểm tra nếu còn trang nữa thì tiếp tục gọi API
        if (response.total && currentPage < response.total) {
          currentPage++;
          fetchPage(currentPage); // Gọi đệ quy để lấy trang tiếp theo
        } else {
          // Sau khi đã lấy tất cả dữ liệu, gọi hàm tạo biểu đồ
          this.createChart(allBooks);
        }
      });
    };

    // Bắt đầu lấy dữ liệu từ trang 1
    fetchPage(currentPage);
  }

  // Hàm tạo biểu đồ
  createChart(bookStocks: any[]): void {
    // Tính toán số lượng sách theo tình trạng
    const bookConditions = bookStocks.reduce((acc, bookStock) => {
      const condition = bookStock.BookCond;
      if (!acc[condition]) {
        acc[condition] = { CurrentQty: 0, PlacedQty: 0, ExpectedQty: 0, ReturnedQty: 0 }; // Thêm ReturnedQty
      }
      acc[condition].CurrentQty += bookStock.CurrentQty;
      acc[condition].PlacedQty += bookStock.PlacedQty;
      acc[condition].ExpectedQty += bookStock.ExpectedQty;
      acc[condition].ReturnedQty += bookStock.ReturnedQty; // Cộng dồn số lượng sách trả lại
      return acc;
    }, {});

    // Các giá trị trục X (Tình trạng sách)
    const conditions = Object.keys(bookConditions);
    
    // Các giá trị trục Y (Số lượng sách)
    const currentQty = conditions.map(condition => bookConditions[condition].CurrentQty);
    const placedQty = conditions.map(condition => bookConditions[condition].PlacedQty);
    const expectedQty = conditions.map(condition => bookConditions[condition].ExpectedQty);
    const returnedQty = conditions.map(condition => bookConditions[condition].ReturnedQty); // Số lượng sách trả lại

    // Tạo biểu đồ sách theo tình trạng
    this.barChart = new Chart('barChart', {
      type: 'bar', // Biểu đồ cột
      data: {
        labels: conditions, // Tên các tình trạng sách
        datasets: [
          {
            label: 'Current Qty',
            data: currentQty,
            backgroundColor: 'rgb(54, 163, 235)', // Màu nền của các cột
            borderColor: 'rgba(54, 162, 235, 1)', // Màu đường viền của các cột
            borderWidth: 1
          },
          {
            label: 'Placed Qty',
            data: placedQty,
            backgroundColor: 'rgb(250, 14, 164)', // Màu nền của các cột
            borderColor: 'rgb(250, 14, 164)', // Màu đường viền của các cột
            borderWidth: 1
          },
          {
            label: 'Expected Qty',
            data: expectedQty,
            backgroundColor: 'rgb(11, 192, 62)', // Màu nền của các cột
            borderColor: 'rgb(11, 192, 62)', // Màu đường viền của các cột
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true, // Biểu đồ sẽ phản hồi với thay đổi kích thước
        plugins: {
          title: {
            display: true, // Hiển thị tiêu đề
            text: 'Book Stock Quantity by Condition', // Tiêu đề biểu đồ
            font: {
              size: 15, // Kích thước font chữ
              weight: 'bold', // Độ dày chữ
            },
            color: 'black', // Màu chữ của tiêu đề
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              color: 'black', // Màu chữ của các nhãn trục X
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: 'black', // Màu chữ của các nhãn trục Y
            },
            title: { // Thêm tiêu đề cho trục Y
              display: true,
              text: 'Quantity', // Tên trục Y của biểu đồ
              color: 'black',
              font: { size: 12, },
            },
          },
        }
      }
    });

    // Biểu đồ trả lại sách theo tình trạng
    this.returnedChart = new Chart('returnedBooksChart', {
      type: 'bar', // Biểu đồ cột
      data: {
        labels: conditions, // Tên các tình trạng sách
        datasets: [
          {
            label: 'Returned Qty',
            data: returnedQty,
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Màu nền của các cột
            borderColor: 'rgba(255, 99, 132, 1)', // Màu đường viền của các cột
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Returned Books by Condition', // Tiêu đề biểu đồ
            font: { size: 15, weight: 'bold' },
            color: 'black'
          }
        },
        scales: {
          x: { beginAtZero: true, ticks: { color: 'black' } },
          y: { beginAtZero: true, ticks: { color: 'black' },
            title: { // Thêm tiêu đề cho trục Y
              display: true,
              text: 'Quantity', // Tên trục Y của biểu đồ
              color: 'black',
              font: { size: 12, },
            }
          }
        }
      }
    });
  }
}
