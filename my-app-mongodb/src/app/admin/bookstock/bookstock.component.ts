import { Component } from '@angular/core';
import { BookStock, createBookStock } from '../../classes/BookStock';
import { BookStockApiService } from '../../book-stock-api.service';

@Component({
  selector: 'app-bookstock',
  standalone: false,
  templateUrl: './bookstock.component.html',
  styleUrl: './bookstock.component.css'
})
export class BookstockComponent {
 bookstocks: BookStock[] = [];
 currentPage: number = 1;
  pageSize: number = 10; //số đơn hàng mỗi trang
  totalBookStock: number = 0;  //tổng số đơn hàng trong hệ thống
  showCreateMBookStockModal: boolean = false;
  searchQuery: string = '';
  sortBy: string='BookISBN_n';
  sortOrder: 'asc' | 'desc' = 'asc';
  isEditing: { [key: string]: boolean } = {};
  originalBookStock: { [key: string]: BookStock } = {};
  newBookStock: createBookStock = {
    BookISBN_n: '',
    BookPrice: 0,
    BookSales: 0,
    BookImg1: '',
    BookImg2: '',
    BookCond: '',
    CurrentQty: 0,
    PlacedQty: 0,
    ExpectedQty: 0,
    ReturnedQty: 0,
    BookInfoID: 0,
    BookTitle: ''
  };

  BookCond: string[] = ["Like New", "Good","Acceptable"];
  constructor(
    private bookstockService: BookStockApiService,
  ) { }

  ngOnInit(): void {
    this.loadBookStock();
  }

  get totalPages(): number {
    return Math.ceil(this.totalBookStock / this.pageSize);
  }

  // load dữ liệu từ API
  loadBookStock(): void {
    this.bookstockService.getBookStock(this.currentPage, this.pageSize, this.searchQuery, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        if (!data || !Array.isArray(data.data)) {
          console.error('Invalid API response:', data);
          alert('Invalid data received from API');
          return;
        }
        this.bookstocks = data.data.map(bookstock => ({
          ...bookstock,
        }));
        this.bookstocks = data.data;
        this.totalBookStock = data.total;
      },
      error: (err) => {
        console.error('API error:', err);
        alert('An error occurred while loading orders. Please try again.');
      }
    });
  }

  onFileSelected(event: any, imageField: string, bookstock: any) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            bookstock[imageField] = reader.result as string; // Lưu URL base64 của ảnh
        };
        reader.readAsDataURL(file);
    }
}


  onSearch(): void {
    this.searchQuery = this.searchQuery.trim(); // Loại bỏ khoảng trắng đầu/cuối
     this.currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
    this.loadBookStock();
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
    this.loadBookStock();
  }

  // tạo mới BookStock
  openCreateBookStockModal() {
    this.showCreateMBookStockModal = true;
  }
  
  closeCreateBookStockModal() {
    this.showCreateMBookStockModal = false;
  }

  resetNewBookStock() {
    this.newBookStock = {
      BookISBN_n: '',
      BookPrice: 0,
      BookSales: 0,
      BookImg1: '',
      BookImg2: '',
      BookCond: '',
      CurrentQty: 0,
      PlacedQty: 0,
      ExpectedQty: 0,
      ReturnedQty: 0,
      BookInfoID: 0,
      BookTitle: ''
    };
  }

  createBookStock() {
    if(!this.newBookStock.BookISBN_n || !this.newBookStock.BookPrice || !this.newBookStock.BookSales || !this.newBookStock.BookImg1 || !this.newBookStock.BookImg2 || !this.newBookStock.BookCond || !this.newBookStock.CurrentQty || !this.newBookStock.PlacedQty || !this.newBookStock.ExpectedQty || !this.newBookStock.ReturnedQty || !this.newBookStock.BookInfoID || !this.newBookStock.BookTitle) {
      alert('Please fill in all required fields');

    this.bookstockService.createBookStock({...this.newBookStock}).subscribe({
      next: () => {
        alert('BookStock created successfully');
        this.loadBookStock();
        this.closeCreateBookStockModal();
      },
      error: (err) => {
        console.error('Create error:', err);
        alert('An error occurred while creating the order. Please try again.');
      }
    });
  }
}

// sửa BookStock
startEditing(bookstockID: string) {
  const bookstock = this.bookstocks.find(b => b._id === bookstockID);
  if (bookstock) {
    this.originalBookStock[bookstockID] = { ...bookstock}; // Lưu bản sao dữ liệu gốc
  }
  this.isEditing[bookstockID] = true;
}

 saveBookStock(bookstock: BookStock) {
    if (!bookstock._id) {
      console.error('Error: bookstock._id is undefined',bookstock);
      alert('Không tìm thấy ID của bookstock để cập nhật.');
      return;
    }
    if (
      !bookstock.BookPrice ||
      !bookstock.CurrentQty

    ) {
      alert('Please enter all the required information completely!');
      return;
    }

    console.log('Updating bookstock with _id:', bookstock._id); // Kiểm tra ID trước khi gọi API
    // Tạo một đối tượng mới mà không có trường `_id`
    const { _id, ...updateData } = bookstock;

    this.bookstockService.updateBookStock(_id, updateData).subscribe({
      next: () => {
        alert('BookStock updated successfully!');
        this.isEditing[bookstock._id] = false; // Tắt chế độ chỉnh sửa
        this.loadBookStock(); // Refresh dữ liệu
      },
      error: (err) => {
        console.error('API error:', err);
        alert(`Failed to update bookstock. Error: ${err.message}`);
      }
    });
  }
  cancelEditing(bookstockID: string) {
    if (this.originalBookStock[bookstockID]) {
      // Tạo một bản sao mới để Angular nhận diện sự thay đổi
      this.bookstocks = this.bookstocks.map(bookstock =>
        bookstock._id === bookstockID ? { ...this.originalBookStock[bookstockID] } : bookstock
      );
    }
    // Xóa bản sao sau khi khôi phục
    delete this.originalBookStock[bookstockID];
    this.isEditing[bookstockID] = false;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBookStock();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBookStock();
    }
  }
}
