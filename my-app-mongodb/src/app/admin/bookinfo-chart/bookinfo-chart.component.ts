import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BookinfoApiService } from '../../bookinfo-api.service';
import { Color, ColorHelper } from '@swimlane/ngx-charts';
import { Chart, ChartData, ChartOptions, ChartType } from 'chart.js';



@Component({
  selector: 'app-bookinfo-chart',
  standalone: false,
  templateUrl: './bookinfo-chart.component.html',
  styleUrl: './bookinfo-chart.component.css'
})
export class BookinfoChartComponent implements OnInit {
  @ViewChild('barChart') barChartElement!: ElementRef;
  barChart: any;
  bookGenres: string[] = [];
  genreCounts: number[] = [];
  languageCounts: { [language: string]: number[] } = {};  // Dữ liệu đếm số lượng sách theo ngôn ngữ cho từng thể loại
  languages: string[] = [];

  constructor(private bookInfoApiService: BookinfoApiService) { }

  ngOnInit(): void {
    this.fetchBookInfo();
  }

  fetchBookInfo(): void {
    let currentPage = 1;
    const allBooks: any[] = []; // Mảng lưu trữ tất cả các sách
  
    // Hàm để lấy dữ liệu của mỗi trang
    const fetchPage = (page: number) => {
      this.bookInfoApiService.getBookInfo(page, 100).subscribe(data => {
        // Thêm các sách của trang hiện tại vào mảng allBooks
        allBooks.push(...data.data);
  
        // Kiểm tra xem còn trang nào nữa không, nếu có thì gọi tiếp
        if (data.total && currentPage < data.total) {
          currentPage++;
          fetchPage(currentPage); // Gọi đệ quy để lấy trang tiếp theo
        } else {
          // Sau khi lấy hết tất cả các trang, xử lý dữ liệu và vẽ biểu đồ
          this.processData(allBooks);
          this.createChart();
        }
      });
    };
  
    // Bắt đầu lấy dữ liệu từ trang 1
    fetchPage(currentPage);
  }

  processData(data: any[]): void {
    const genreCountMap: { [key: string]: number } = {};
    const languageCountMap: { [genre: string]: { [language: string]: number } } = {};

    // Đếm số lượng sách theo thể loại và ngôn ngữ
    data.forEach(book => {
      const genre = book.BookGenre;
      const language = book.BookLang;

      // Đếm theo thể loại
      if (genreCountMap[genre]) {
        genreCountMap[genre]++;
      } else {
        genreCountMap[genre] = 1;
      }

      // Đếm theo thể loại và ngôn ngữ
      if (!languageCountMap[genre]) {
        languageCountMap[genre] = {};
      }
      if (languageCountMap[genre][language]) {
        languageCountMap[genre][language]++;
      } else {
        languageCountMap[genre][language] = 1;
      }
    });

    // Lấy danh sách thể loại và số lượng sách theo thể loại
    this.bookGenres = Object.keys(genreCountMap);
    this.genreCounts = Object.values(genreCountMap);

    // Xử lý số lượng sách theo ngôn ngữ cho từng thể loại
    this.bookGenres.forEach(genre => {
      const languagesForGenre = languageCountMap[genre];
      this.languages = [...this.languages, ...Object.keys(languagesForGenre)];
      this.languageCounts[genre] = Object.values(languagesForGenre);
    });

    // Loại bỏ các ngôn ngữ trùng lặp
    this.languages = Array.from(new Set(this.languages));
  }

  // Hàm tạo màu ngẫu nhiên cho mỗi thể loại
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  createChart(): void {
    const canvas = this.barChartElement?.nativeElement.getContext('2d');
    if (canvas) {
      const colors = this.languages.map(() => this.getRandomColor());  // Tạo mảng màu sắc cho các ngôn ngữ
      const datasets = this.languages.map((language, languageIndex) => ({
        label: language,
        data: this.bookGenres.map(genre => this.languageCounts[genre]?.[languageIndex] || 0),
        backgroundColor: colors[languageIndex], // Màu sắc khác nhau cho từng ngôn ngữ
        borderColor: colors[languageIndex].replace('0.2', '1'), // Màu viền cho từng ngôn ngữ
        borderWidth: 1
      }));

      this.barChart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: this.bookGenres,
          datasets: datasets // Dữ liệu chồng cho từng ngôn ngữ
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { 
              title: { 
                display: true, 
                text: 'BookGenre',
                color: 'black'
              }
            },
            y: { 
              title: { 
                display: true, 
                text: 'Number of Books',
                color: 'black'
              },
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Books Distribution by Genre and Language', // Tên biểu đồ
              font: {
                size: 15,
                weight: 'bold',
              },
              color: 'black'
            }
          }
        }
      });
    }
  }
}
