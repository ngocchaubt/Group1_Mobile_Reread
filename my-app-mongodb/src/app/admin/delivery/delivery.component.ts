import { Component } from '@angular/core';
import { Delivery } from '../../classes/Delivery';
import { DeliveryApiService } from '../../delivery-api.service';

@Component({
  selector: 'app-delivery',
  standalone: false,
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css'
})
export class DeliveryComponent {
  deliveries: Delivery[] = [];
  currentPage: number = 1;  
  pageSize: number = 10;
  totaldelivery: number = 0;
  searchQuery: string = '';
  sortBy: string='ShipmentStatus';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private deliveryService: DeliveryApiService,
  ) { }

  ngOnInit(): void {
    this.loadDelivery();
  }

  get totalPages(): number {
    return Math.ceil(this.totaldelivery/ this.pageSize);
  }

  loadDelivery(): void {
    this.deliveryService.getDelivery(this.currentPage, this.pageSize,  this.searchQuery, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        console.log("Data from API:", data);
        if (!data || !Array.isArray(data.data)) {
          console.error('Invalid API response:', data);
          alert('Invalid data received from API');
          return;
        }
        this.deliveries = data.data.map(delivery => ({
          ...delivery,
        }));
        this.deliveries = data.data;
        this.totaldelivery = data.total;
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
    this.loadDelivery();
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
    this.loadDelivery();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDelivery();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadDelivery();
    }
  }
}
