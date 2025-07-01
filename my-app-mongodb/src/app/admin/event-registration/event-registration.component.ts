import { Component } from '@angular/core';
import { EventRegistration } from '../../classes/EventRegistration';
import { EventRegistrationApiService } from '../../event-registration-api.service';

@Component({
  selector: 'app-event-registration',
  standalone: false,
  templateUrl: './event-registration.component.html',
  styleUrl: './event-registration.component.css'
})
export class EventRegistrationComponent {
  eventregistrations: EventRegistration[] = [];
  currentPage: number = 1;  
  pageSize: number = 10;
  totaleventregistration: number = 0;
  searchQuery: string = '';
  sortBy: string='EventID';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private eventregistrationService: EventRegistrationApiService,
  ) { }

  ngOnInit(): void {
    this.loadEventRegistration();
  }

  get totalPages(): number {
    return Math.ceil(this.totaleventregistration/ this.pageSize);
  }

  loadEventRegistration(): void {
    this.eventregistrationService.getEventRegistration(this.currentPage, this.pageSize, this.searchQuery, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        console.log("Data from API:", data);
        if (!data || !Array.isArray(data.data)) {
          console.error('Invalid API response:', data);
          alert('Invalid data received from API');
          return;
        }
        this.eventregistrations = data.data.map(eventregistration => ({
          ...eventregistration,
        }));
        this.eventregistrations = data.data;
        this.totaleventregistration = data.total;
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
    this.loadEventRegistration();
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
    this.loadEventRegistration();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEventRegistration();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEventRegistration();
    }
  }
}
