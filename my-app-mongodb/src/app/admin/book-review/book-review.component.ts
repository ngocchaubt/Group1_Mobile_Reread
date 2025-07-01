import { Component } from '@angular/core';
import { BookReview } from '../../classes/BookReivew';
import { BookReviewApiService } from '../../book-review-api.service';

@Component({
  selector: 'app-book-review',
  standalone: false,
  templateUrl: './book-review.component.html',
  styleUrl: './book-review.component.css'
})
export class BookReviewComponent {
  bookreviews: BookReview[] = [];
  currentPage: number = 1;
  pageSize: number = 10; //số đơn hàng mỗi trang
  totalbookreview: number = 0;  //tổng số đơn hàng trong hệ thống
  searchQuery: string = '';
  sortBy: string='Rating';
  sortOrder: 'asc' | 'desc' = 'asc';
  

  constructor(
    private bookreviewService: BookReviewApiService,
  ) { }

  ngOnInit(): void {
    this.loadBookReview();
  }

  get totalPages(): number {
    return Math.ceil(this.totalbookreview/ this.pageSize);
  }
  // load dữ liệu từ API
  loadBookReview(): void {
    this.bookreviewService.getBookReview(this.currentPage, this.pageSize, this.searchQuery, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        if (!data || !Array.isArray(data.data)) {
          console.error('Invalid API response:', data);
          alert('Invalid data received from API');
          return;
        }
        this.bookreviews = data.data.map(bookreview => ({
          ...bookreview,
        }));
        this.bookreviews = data.data;
        this.totalbookreview = data.total;
      },
      error: (err) => {
        console.error('API error:', err);
        alert('An error occurred while loading orders. Please try again.');
      }
    });
  }

  onSearch(): void {
    this.searchQuery = this.searchQuery.trim(); // Loại bỏ khoảng trắng đầu/cuối
     this.currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
    this.loadBookReview();
  }
  
  
  onSort(sortBy: string): void {
    console.log('Sorting by:', sortBy, 'Current Order:', this.sortOrder);
    if (this.sortBy === sortBy) {
      // Đảo ngược thứ tự sắp xếp nếu nhấp lại
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Nếu nhấp vào cột mới, đặt cột đó làm cột sắp xếp và mặc định 'asc'
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }
    this.loadBookReview();
  }

  deleteBookReview(bookreview: BookReview) {
    if (!bookreview || !bookreview._id) {
      console.error('Error: bookreview._id is undefined', bookreview);
      alert('Không tìm thấy ID của Review để xóa.');
      return;
    }

    console.log('Deleting Review with _id:', bookreview._id);

    if (!confirm('Bạn có chắc chắn muốn xóa review này không?')) {
      return;
    }

    this.bookreviewService.deleteBookReview(bookreview._id).subscribe({
      next: () => {
        alert(' Review deleted successfully!');
        this.loadBookReview();
      },
      error: (err) => {
        console.error('API error:', err);
        alert(`Failed to delete Review. Error: ${err.message}`);
      }
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBookReview();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBookReview();
    }
  }
}
