import { Component } from '@angular/core';
import { Category, createCategory } from '../../classes/Category';
import { CategoryApiService } from '../../category-api.service';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categories: Category[] = [];
  currentPage: number = 1;
  pageSize: number = 10; //số đơn hàng mỗi trang
  totalCategory: number = 0;  //tổng số đơn hàng trong hệ thống
  showCreateMCategoryModal: boolean = false;
  searchQuery: string = '';
  sortBy: string='BookCateID';
  sortOrder: 'asc' | 'desc' = 'asc';
  isEditing: { [key: string]: boolean } = {};
  originalCategory: { [key: string]: Category } = {};
  newCategory: createCategory = {
    BookCateID: '',
    BookCateName: '',
    BookCateDesc: ''
  };

  BookCateName: string[] = ["Art", "Literature","Music","Photography","Science","Textbook", "Math", "Politics", "Dictionary","Philosophy","Physics","Medicine","Language Learning"];

  BookCateID: string[] = ["1A", "2L","3M","4P","5S","6T"];

  constructor(
    private categoryService: CategoryApiService,
  ) { }

  ngOnInit(): void {
    this.loadCategory();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCategory / this.pageSize);
  }
  // load dữ liệu từ API
  loadCategory(): void {
    this.categoryService.getCategory(this.currentPage, this.pageSize, this.searchQuery, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        if (!data || !Array.isArray(data.data)) {
          console.error('Invalid API response:', data);
          alert('Invalid data received from API');
          return;
        }
        this.categories = data.data.map(category => ({
          ...category,
        }));
        this.categories = data.data;
        this.totalCategory = data.total;
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
    this.loadCategory();
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
    this.loadCategory();
  }

  // tạo mới Category
  openCreateCategoryModal() {
    this.showCreateMCategoryModal = true;
  }

  closeCreateCategoryModal() {
    this.showCreateMCategoryModal = false;
    this.resetNewCategory();
  }

  resetNewCategory() {
    this.newCategory = {
      BookCateID: '',
      BookCateName: '',
      BookCateDesc: ''
    };
  }

  createCategory() {
    // Kiểm tra nếu bất kỳ trường nào bị bỏ trống
    if (
      this.newCategory.BookCateID === null ||
      this.newCategory.BookCateName === null ||
      this.newCategory.BookCateDesc === null
    ) {
      alert('Vui lòng nhập đầy đủ tất cả thông tin!');
      return;
    }

    // Kiểm tra trùng BookCateID trước khi tạo mới
    const isDuplicate = this.categories.some(category => category.BookCateID === this.newCategory.BookCateID);
    if (isDuplicate) {
      alert('BookCateID đã tồn tại, vui lòng nhập mã khác!');
      return;
    }

    this.categoryService.createCategory({ ...this.newCategory }).subscribe({
      next: () => {
        alert('Category created successfully!');
        this.closeCreateCategoryModal();
        this.loadCategory();
      },
      error: (err) => {
        console.error('API error:', err);
        alert('Failed to create Category. Please try again.');
      }
    });
  }


  // Xóa category
  deleteCategory(category: Category) {
    if (!category || !category._id) {
      console.error('Error: category._id is undefined', category);
      alert('Không tìm thấy ID của category để xóa.');
      return;
    }

    console.log('Deleting category with _id:', category._id);

    if (!confirm('Bạn có chắc chắn muốn xóa category này không?')) {
      return;
    }

    this.categoryService.deleteCategory(category._id).subscribe({
      next: () => {
        alert('Category deleted successfully!');
        this.loadCategory();
      },
      error: (err) => {
        console.error('API error:', err);
        alert(`Failed to delete category. Error: ${err.message}`);
      }
    });
  }


  // Cập nhật Category
  // Bắt đầu chỉnh sửa
  startEditing(categoryID: string) {
    const category = this.categories.find(c => c._id === categoryID);
    if (category) {
      this.originalCategory[categoryID] = { ...category }; // Lưu bản sao dữ liệu gốc
    }
    this.isEditing[categoryID] = true;
  }

  // Lưu cập nhật
  saveCategory(category: Category) {
    if (!category._id) {
      console.error('Error: category._id is undefined', category);
      alert('Không tìm thấy ID của category để cập nhật.');
      return;
    }
    if (
      category.BookCateID === null ||
      category.BookCateName === null ||
      category.BookCateDesc === null
    ) {
      alert('Vui lòng nhập đầy đủ tất cả thông tin!');
      return;
    }

    // Kiểm tra trùng BookCateID (ngoại trừ chính nó)
    const isDuplicate = this.categories.some(c => c.BookCateID === category.BookCateID && c._id !== category._id);
    if (isDuplicate) {
      alert('BookCateID đã tồn tại, vui lòng nhập mã khác!');
      return;
    }

    console.log('Updating category with _id:', category._id); // Kiểm tra ID trước khi gọi API
    // Tạo một đối tượng mới mà không có trường `_id`
    const { _id, ...updateData } = category;

    this.categoryService.updateCategory(_id, updateData).subscribe({
      next: () => {
        alert('Category updated successfully!');
        this.isEditing[category._id] = false; // Tắt chế độ chỉnh sửa
        this.loadCategory(); // Refresh dữ liệu
      },
      error: (err) => {
        console.error('API error:', err);
        alert(`Failed to update category. Error: ${err.message}`);
      }
    });
  }
  cancelEditing(categoryID: string) {
    const category = this.categories.find(c => c._id === categoryID);
    if (category) {
      this.categories[this.categories.indexOf(category)] = this.originalCategory[categoryID];
    }
    this.isEditing[categoryID] = false;
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCategory();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCategory();
    }
  }
}
