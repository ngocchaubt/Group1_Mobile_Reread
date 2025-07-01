import { Component } from '@angular/core';
import { EventReview } from '../../classes/EventReview';
import { EventReviewApiService } from '../../event-review-api.service';

@Component({
  selector: 'app-event-review',
  standalone: false,
  templateUrl: './event-review.component.html',
  styleUrl: './event-review.component.css'
})
export class EventReviewComponent {
  eventreviews: EventReview[] = [];
  currentPage: number = 1;
  pageSize: number = 10; //số đơn hàng mỗi trang
  totaleventreview: number = 0;  //tổng số đơn hàng trong hệ thống
  searchQuery: string = '';
  sortBy: string = 'Rating';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private eventreviewService: EventReviewApiService,
  ) { }

  ngOnInit(): void {
    this.loadEventReview();
  }

  get totalPages(): number {
    return Math.ceil(this.totaleventreview / this.pageSize);
  }
  // load dữ liệu từ API
  loadEventReview(): void {
    this.eventreviewService.getEventReview(this.currentPage, this.pageSize, this.searchQuery, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        if (!data || !Array.isArray(data.data)) {
          console.error('Invalid API response:', data);
          alert('Invalid data received from API');
          return;
        }
        this.eventreviews = data.data.map(eventreview => ({
          ...eventreview,
        }));
        this.eventreviews = data.data;
        this.totaleventreview = data.total;
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
    this.loadEventReview();
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
    this.loadEventReview();
  }


  deleteEventReview(eventreview: EventReview) {
    if (!eventreview || !eventreview._id) {
      console.error('Error: eventreview._id is undefined', eventreview);
      alert('Không tìm thấy ID của Review để xóa.');
      return;
    }

    console.log('Deleting Review with _id:', eventreview._id);

    if (!confirm('Bạn có chắc chắn muốn xóa review này không?')) {
      return;
    }

    this.eventreviewService.deleteEventReview(eventreview._id).subscribe({
      next: () => {
        alert(' Review deleted successfully!');
        this.loadEventReview();
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
      this.loadEventReview();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEventReview();
    }
  }
}
