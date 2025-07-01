import { Component } from '@angular/core';
import { BookInfo, createBookInfo } from '../../classes/BookInfo';
import { BookinfoApiService } from '../../bookinfo-api.service';

@Component({
  selector: 'app-bookinfo',
  standalone: false,
  templateUrl: './bookinfo.component.html',
  styleUrl: './bookinfo.component.css'
})
export class BookinfoComponent {
  bookinfo_s: BookInfo[] = [];
  currentPage: number = 1;
  pageSize: number = 10; //số đơn hàng mỗi trang
  totalBookInfo: number = 0;  //tổng số đơn hàng trong hệ thống
  showCreateMBookInfoModal: boolean = false;
  searchQuery: string = '';
  sortBy: string='BookTile';
  sortOrder: 'asc' | 'desc' = 'asc';
  isEditing: { [key: string]: boolean } = {};
  originalBookInfo: { [key: string]: BookInfo } = {};
  newBookInfo: createBookInfo = {
    BookInfoID: 0,
    BookTitle: '',
    BookAut: '',
    BookPub: '',
    BookDesc: '',
    BookGenre: '',
    BookLang: '',
    BookCateID: ''
  };

  BookGenre: string[] = ["Art", "Literature","Music","Photography","Science","Textbook", "Math", "Politics", "Dictionary","Philosophy","Physics","Medicine","Language Learning"];
  BookLang:string[] = ["Tiếng Việt", "English"];
  BookCateID: string[] = ["1A", "2L","3M","4P","5S","6T"];

  constructor(
    private bookinfoService: BookinfoApiService,
  ) { }

  ngOnInit(): void {
    this.loadBookInfo();
  }

  get totalPages(): number {
    return Math.ceil(this.totalBookInfo / this.pageSize);
  }
  // load dữ liệu từ API
  loadBookInfo(): void {
    this.bookinfoService.getBookInfo(this.currentPage, this.pageSize, this.searchQuery, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        if (!data || !Array.isArray(data.data)) {
          console.error('Invalid API response:', data);
          alert('Invalid data received from API');
          return;
        }
        this.bookinfo_s = data.data.map(bookinfo => ({
          ...bookinfo,
        }));
        this.bookinfo_s = data.data;
        this.totalBookInfo = data.total;
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
    this.loadBookInfo();
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
    this.loadBookInfo();
  }

  // tạo mới BookInfo
  openCreateBookInfoModal() {
    this.showCreateMBookInfoModal = true;
  }

  closeCreateBookInfoModal() {
    this.showCreateMBookInfoModal = false;
    this.resetNewBookInfo();
  }

  resetNewBookInfo() {
    this.newBookInfo = {
      BookInfoID: 0,
      BookTitle: '',
      BookAut: '',
      BookPub: '',
      BookDesc: '',
      BookGenre: '',
      BookLang: '',
      BookCateID: ''
    };
  }

  createBookInfo() {
    // Kiểm tra nếu bất kỳ trường nào bị bỏ trống
    if (
      !this.newBookInfo.BookInfoID ||
      !this.newBookInfo.BookTitle ||
      !this.newBookInfo.BookAut ||
      !this.newBookInfo.BookPub ||
      !this.newBookInfo.BookDesc ||
      !this.newBookInfo.BookGenre ||
      !this.newBookInfo.BookLang ||
      !this.newBookInfo.BookCateID
    ) {
      alert('Vui lòng nhập đầy đủ tất cả thông tin!');
      return;
    }



    this.bookinfoService.createBookInfo({ ...this.newBookInfo }).subscribe({
      next: () => {
        alert('BookInfo created successfully!');
        this.closeCreateBookInfoModal();
        this.loadBookInfo();
      },
      error: (err) => {
        console.error('API error:', err);
        alert('Failed to create BookInfo. Please try again.');
      }
    });
  }



  // Cập nhật BookInfo
  // Bắt đầu chỉnh sửa
  startEditing(bookinfoID: string) {
    const bookinfo = this.bookinfo_s.find(b => b._id === bookinfoID);
    if (bookinfo) {
      this.originalBookInfo[bookinfoID] = { ...bookinfo }; // Lưu bản sao dữ liệu gốc
    }
    this.isEditing[bookinfoID] = true;
  }
  
  

  // Lưu cập nhật
  saveBookInfo(bookinfo: BookInfo) {
    if (!bookinfo._id) {
      console.error('Error: bookinfo._id is undefined', bookinfo);
      alert('Không tìm thấy ID của bookinfo để cập nhật.');
      return;
    }
    if (
      !bookinfo.BookInfoID ||
      !bookinfo.BookTitle ||
      !bookinfo.BookAut ||
      !bookinfo.BookPub ||
      !bookinfo.BookDesc ||
      !bookinfo.BookGenre ||
      !bookinfo.BookLang ||
      !bookinfo.BookCateID
    ) {
      alert('Vui lòng nhập đầy đủ tất cả thông tin!');
      return;
    }

    console.log('Updating bookinfo with _id:', bookinfo._id); // Kiểm tra ID trước khi gọi API
    // Tạo một đối tượng mới mà không có trường `_id`
    const { _id, ...updateData } = bookinfo;

    this.bookinfoService.updateBookInfo(_id, updateData).subscribe({
      next: () => {
        alert('BookInfo updated successfully!');
        this.isEditing[bookinfo._id] = false; // Tắt chế độ chỉnh sửa
        this.loadBookInfo(); // Refresh dữ liệu
      },
      error: (err) => {
        console.error('API error:', err);
        alert(`Failed to update bookinfo. Error: ${err.message}`);
      }
    });
  }
  cancelEditing(bookinfoID: string) {
    if (this.originalBookInfo[bookinfoID]) {
      // Tạo một bản sao mới để Angular nhận diện sự thay đổi
      this.bookinfo_s = this.bookinfo_s.map(bookinfo =>
        bookinfo._id === bookinfoID ? { ...this.originalBookInfo[bookinfoID] } : bookinfo
      );
    }
    // Xóa bản sao sau khi khôi phục
    delete this.originalBookInfo[bookinfoID];
    this.isEditing[bookinfoID] = false;
  }
  
  
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBookInfo();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBookInfo();
    }
  }
}
