import { Component } from '@angular/core';
import { SaleOrder, createSaleOrder } from '../../classes/SaleOrder';
import { SaleOrderAPIService } from '../../sale-order-api.service';
import { Discount } from '../../classes/Discount';

@Component({
  selector: 'app-sale-order',
  standalone: false,
  templateUrl: './sale-order.component.html',
  styleUrl: './sale-order.component.css'
})
export class SaleOrderComponent {
  orders: SaleOrder[] = [];
  currentPage: number = 1;
  pageSize: number = 10; //số đơn hàng mỗi trang
  totalSaleOrder: number = 0;  //tổng số đơn hàng trong hệ thống
  showCreateSaleOrderModal: boolean = false;
  searchQuery: string = '';
  sortBy: string='OrderTotal';
  sortOrder: 'asc' | 'desc' = 'asc';
  isEditing: { [key: string]: boolean } = {};
  originalSaleOrder: { [key: string]: SaleOrder } = {};
  newSaleOrder: createSaleOrder = {
    UserID: '',
    DiscountID: '',
    OrderTotal: 0,
    OrderDate: '',
    DeliveryMethod: '',
    OrderStatus: '',
    PaymentStatus: '',
    Books: [ { 
      BookISBN_n: '', 
      BookQuantity: 0
    } ],
    username: '',
    address: ''
  };



  DeliveryMethods: string[] = ["Self-pick", "DoorDash"]

  OrderStatus : string[] = ["Processing", "Completed","Cancelled","Return","Shipped","'Delivered"]

  PaymentStatus : string[] = ["Paid", "Expected","Refunded"]

  constructor(
      private orderService: SaleOrderAPIService,
    ) { }
  
    ngOnInit(): void {
      this.loadSaleOrder();
    }
  
    get totalPages(): number {
      return Math.ceil(this.totalSaleOrder / this.pageSize);
    }
    // load dữ liệu từ API
    loadSaleOrder(): void {
      this.orderService.getSaleOrder(this.currentPage, this.pageSize, this.searchQuery, this.sortBy, this.sortOrder).subscribe({
        next: (data) => {
          if (!data || !Array.isArray(data.data)) {
            console.error('Invalid API response:', data);
            alert('Invalid data received from API');
            return;
          }
          this.orders = data.data.map(order => ({
            ...order,
          }));
          this.orders = data.data;
          this.totalSaleOrder = data.total;
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
      this.loadSaleOrder();
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
      this.loadSaleOrder();
    }
  
  
    // tạo mới SaleOrder
    openCreateSaleOrderModal() {
      console.log("Tạo Order button clicked.");
      this.showCreateSaleOrderModal = true;
    }
    
  
    closeCreateSaleOrderModal() {
      this.showCreateSaleOrderModal = false;
      this.resetNewSaleOrder();
    }
  
    resetNewSaleOrder() {
      this.newSaleOrder = {
        UserID: '',
        DiscountID: '',
        OrderTotal: 0,
        OrderDate: '',
        DeliveryMethod: '',
        OrderStatus: '',
        PaymentStatus: '',
        Books: [ { 
          BookISBN_n: '', 
          BookQuantity: 0
        } ],
        username: '',
        address: ''
      };
    }
  
    createSaleOrder() {
      // Kiểm tra nếu bất kỳ trường nào bị bỏ trống
      if (
        !this.newSaleOrder.UserID ||
        !this.newSaleOrder.DiscountID ||
        !this.newSaleOrder.OrderTotal ||
        !this.newSaleOrder.OrderDate ||
        !this.newSaleOrder.DeliveryMethod ||
        !this.newSaleOrder.OrderStatus ||
        !this.newSaleOrder.PaymentStatus ||
        this.newSaleOrder.Books.some(book => !book.BookISBN_n.trim() || book.BookQuantity <= 0)  ||
        !this.newSaleOrder.username ||
        !this.newSaleOrder.address 
    ) 
{
        alert('Please enter all required information and ensure BookQuantity is greater than 0. ');
        return;
      }
  
      this.orderService.createSaleOrder({ ...this.newSaleOrder }).subscribe({
        next: () => {
          alert('SaleOrder created successfully!');
          this.closeCreateSaleOrderModal();
          this.loadSaleOrder();
        },
        error: (err) => {
          console.error('API error:', err);
          alert('Failed to create SaleOrder. Please try again.');
        }
      });
    }
  
  
  
    // Cập nhật SaleOrder
    // Bắt đầu chỉnh sửa
    startEditing(orderID: string) {
      const order = this.orders.find(b => b._id === orderID);
      if (order) {
        this.originalSaleOrder[orderID] = { ...order }; // Lưu bản sao dữ liệu gốc
      }
      this.isEditing[orderID] = true;
    }
    
    
  
    // Lưu cập nhật
    saveSaleOrder(order: SaleOrder) {
      const updatedStatus = { OrderStatus: order.OrderStatus };
  
    this.orderService.updateSaleOrder(order._id!, updatedStatus).subscribe({
      next: () => {
        this.isEditing[order._id!] = false;
        alert('Request status updated successfully.');
      },
      error: (err) => {
        console.error('Update error:', err);
        alert('Failed to update request status.');
      }
    });
  }
    cancelEditing(orderID: string) {
      if (this.originalSaleOrder[orderID]) {
        // Tạo một bản sao mới để Angular nhận diện sự thay đổi
        this.orders = this.orders.map(order =>
          order._id === orderID ? { ...this.originalSaleOrder[orderID] } : order
        );
      }
      // Xóa bản sao sau khi khôi phục
      delete this.originalSaleOrder[orderID];
      this.isEditing[orderID] = false;
    }
    
    
    
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loadSaleOrder();
      }
    }
  
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadSaleOrder();
      }
    }
}
