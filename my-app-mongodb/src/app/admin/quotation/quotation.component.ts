import { Component } from '@angular/core';
import { Quotation } from '../../classes/Quotation';
import { QuotationApiService } from '../../quotation-api.service';

@Component({
  selector: 'app-quotation',
  standalone: false,
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.css'
})
export class QuotationComponent {
  quotations: Quotation[] = [];
  currentPage: number = 1;
  pageSize: number = 10; //số đơn hàng mỗi trang
  totalQuotation: number = 0;  //tổng số đơn hàng trong hệ thống
  isEditing: { [key: string]: boolean } = {};
  originalQuotation: { [key: string]: Quotation } = {};
  searchQuery: string = '';
  sortBy: string='QuotDate';
  sortOrder: 'asc' | 'desc' = 'asc';

  QuotStatus = [
    { value: 'Pending...', label: 'Pending...' },
    { value: 'Declined (shop)', label: 'Declined (shop)' },
    { value: 'Accepted (shop)', label: 'Accepted (shop)' },
    { value: 'Confirmed (seller)', label: 'Confirmed (seller)' },
    { value: 'Received (shop)', label: 'Received (shop)' },
    { value: 'Refused (seller)', label: 'Refused (seller)' },
    { value: 'Returned (shop)', label: 'Returned (shop)' },
  ];

  
  constructor(
    private quotationService: QuotationApiService,
  ) { }

  ngOnInit(): void {
    this.loadQuotation();
  }
  get totalPages(): number {
    return Math.ceil(this.totalQuotation / this.pageSize);
  }

  loadQuotation(): void {
    this.quotationService.getQuotation(this.currentPage, this.pageSize, this.searchQuery, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        if (!data || !Array.isArray(data.data)) {
          console.error('Invalid API response:', data);
          alert('Invalid data received from API');
          return;
        }
        this.quotations = data.data.map(quotation => ({
          ...quotation,
        }));
        this.quotations = data.data;
        this.totalQuotation = data.total;
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
    this.loadQuotation();
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
    this.loadQuotation();
  }

  // Cập nhật quotation
  // Bắt đầu chỉnh sửa
  startEditing(quotationId: string) {
    const quotation = this.quotations.find(b => b._id === quotationId);
    if (quotation) {
      this.originalQuotation[quotationId] = { ...quotation }; // Lưu bản sao dữ liệu gốc
    }
    this.isEditing[quotationId] = true;
  }


  saveQuotation(quotation: Quotation): void {
    const updatedStatus = { QuotStatus: quotation.QuotStatus };

    this.quotationService.updateQuotation(quotation._id!, updatedStatus).subscribe({
      next: () => {
        this.isEditing[quotation._id!] = false;
        alert('Quotation status updated successfully.');
      },
      error: (err) => {
        console.error('Update error:', err);
        alert('Failed to update quotation status.');
      }
    });
  }
  cancelEditing(quotationId: string) {
    const quotation = this.quotations.find(b => b._id === quotationId);
    if (quotation) {
      this.quotations[this.quotations.indexOf(quotation)] = this.originalQuotation[quotationId];
    }
    this.isEditing[quotationId] = false;
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadQuotation();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadQuotation();
    }
  }

}
