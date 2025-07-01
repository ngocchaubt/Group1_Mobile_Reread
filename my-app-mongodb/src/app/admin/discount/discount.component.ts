import { Component } from '@angular/core';
import { CreateDiscount, Discount } from '../../classes/Discount';
import { DiscountApiService } from '../../discount-api.service';


@Component({
  selector: 'app-discount',
  standalone: false,
  templateUrl: './discount.component.html',
  styleUrl: './discount.component.css'
})
export class DiscountComponent {
  discounts: Discount[] = [];
  currentPage: number = 1;
  pageSize: number = 10; //số đơn hàng mỗi trang
  totalDiscount: number = 0;  //tổng số đơn hàng trong hệ thống
  showCreateDiscountModal: boolean = false;
  searchQuery: string = '';
  sortBy: string='DiscRate';
  sortOrder: 'asc' | 'desc' = 'asc';
  isEditing: { [key: string]: boolean } = {};
  originalDiscount: { [key: string]:Discount } = {};
  newDiscount: CreateDiscount = {
    DiscountID: '',
    DiscRate: 0,
    DiscValidFrom: '',
    DiscValidTo: '',
    DiscLeft: 0,
    DiscUsed: 0,
    DiscReq: 0
  };


  constructor(
    private discountService: DiscountApiService,
  ) { }

  ngOnInit(): void {
    this.loadDiscount();
  }

  get totalPages(): number {
    return Math.ceil(this.totalDiscount / this.pageSize);
  }
  // load dữ liệu từ API
  loadDiscount(): void {
    this.discountService.getDiscount(this.currentPage, this.pageSize, this.searchQuery, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        if (!data || !Array.isArray(data.data)) {
          console.error('Invalid API response:', data);
          alert('Invalid data received from API');
          return;
        }
        this.discounts = data.data.map(discount => ({
          ...discount,
        }));
        this.discounts = data.data;
        this.totalDiscount = data.total;
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
    this.loadDiscount();
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
    this.loadDiscount();
  }

  // tạo mới discount
  openCreateDiscountModal() {
    this.showCreateDiscountModal = true;
  }

  closeCreateDiscountModal() {
    this.showCreateDiscountModal = false;
    this.resetNewDiscount();
  }

  resetNewDiscount() {
    this.newDiscount = {
      DiscountID: '',
      DiscRate: 0,
      DiscValidFrom: '',
      DiscValidTo: '',
      DiscLeft: 0,
      DiscUsed: 0,
      DiscReq: 0
    };
  }

  createDiscount() {
    // Kiểm tra nếu bất kỳ trường nào bị bỏ trống
    if (
      !this.newDiscount.DiscountID ||
      this.newDiscount.DiscRate === null ||
      this.newDiscount.DiscValidFrom.trim() === '' ||
      this.newDiscount.DiscValidTo.trim() === '' ||
      this.newDiscount.DiscLeft === null ||
      this.newDiscount.DiscUsed === null ||
      this.newDiscount.DiscReq === null
    ) {
      alert('Vui lòng nhập đầy đủ tất cả thông tin!');
      return;
    }

    // Kiểm tra các giá trị không được âm
    if (
      this.newDiscount.DiscRate < 0 ||
      this.newDiscount.DiscLeft < 0 ||
      this.newDiscount.DiscUsed < 0 ||
      this.newDiscount.DiscReq < 0
    ) {
      alert('DiscRate, DiscLeft, DiscUsed, và DiscReq không được là số âm!');
      return;
    }

    this.discountService.createDiscount({ ...this.newDiscount }).subscribe({
      next: () => {
        alert('Discount created successfully!');
        this.closeCreateDiscountModal();
        this.loadDiscount();
      },
      error: (err) => {
        console.error('API error:', err);
        alert('Failed to create discount. Please try again.');
      }
    });
  }


  // Xóa discount
  deleteDiscount(discount: Discount) {
    if (!discount || !discount._id) {
      console.error('Error: discount._id is undefined', discount);
      alert('Không tìm thấy ID của discount để xóa.');
      return;
    }

    console.log('Deleting discount with _id:', discount._id);

    if (!confirm('Bạn có chắc chắn muốn xóa discount này không?')) {
      return;
    }

    this.discountService.deleteDiscount(discount._id).subscribe({
      next: () => {
        alert('Discount deleted successfully!');
        this.loadDiscount();
      },
      error: (err) => {
        console.error('API error:', err);
        alert(`Failed to delete discount. Error: ${err.message}`);
      }
    });
  }


  // Cập nhật discount
  // Bắt đầu chỉnh sửa
  startEditing(discountID: string) {
    const discount = this.discounts.find(b => b._id === discountID);
    if (discount) {
      this.originalDiscount[discountID] = { ...discount }; // Lưu bản sao dữ liệu gốc
    }
    this.isEditing[discountID] = true;
  }

  // Lưu cập nhật
  saveDiscount(discount: Discount) {
    if (!discount._id) {
      console.error('Error: discount._id is undefined', discount);
      alert('Không tìm thấy ID của discount để cập nhật.');
      return;
    }
    if (
      discount.DiscRate === null ||
      discount.DiscValidFrom.trim() === '' ||
      discount.DiscValidTo.trim() === '' ||
      discount.DiscLeft === null ||
      discount.DiscUsed === null ||
      discount.DiscReq === null
    ) {
      alert('Vui lòng nhập đầy đủ tất cả thông tin!');
      return;
    }

    // Kiểm tra các giá trị không âm
    if (
      discount.DiscRate < 0 ||
      discount.DiscLeft < 0 ||
      discount.DiscUsed < 0 ||
      discount.DiscReq < 0
    ) {
      alert('DiscRate, DiscLeft, DiscUsed, và DiscReq không được là số âm!');
      return;
    }

    console.log('Updating discount with _id:', discount._id); // Kiểm tra ID trước khi gọi API
    // Tạo một đối tượng mới mà không có trường `_id`
    const { _id, ...updateData } = discount;

    this.discountService.updateDiscount(_id, updateData).subscribe({
      next: () => {
        alert('Discount updated successfully!');
        this.isEditing[discount._id] = false; // Tắt chế độ chỉnh sửa
        this.loadDiscount(); // Refresh dữ liệu
      },
      error: (err) => {
        console.error('API error:', err);
        alert(`Failed to update discount. Error: ${err.message}`);
      }
    });
  }
  cancelEditing(discountID: string) {
    if (this.originalDiscount[discountID]) {
      this.discounts = this.discounts.map(discount => {
        if (discount._id === discountID) {
          return this.originalDiscount[discountID];
        }
        return discount;
      });
    }
    this.isEditing[discountID] = false;
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDiscount();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadDiscount();
    }
  }

}
