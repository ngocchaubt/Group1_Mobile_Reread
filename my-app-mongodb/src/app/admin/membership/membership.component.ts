import { Component } from '@angular/core';
import { CreateMembership, Membership } from '../../classes/Membership';
import { MembershipApiService } from '../../membership-api.service';

@Component({
  selector: 'app-membership',
  standalone: false,
  templateUrl: './membership.component.html',
  styleUrl: './membership.component.css'
})
export class MembershipComponent {
  memberships: Membership[] = [];
  currentPage: number = 1;
  pageSize: number = 10; //số đơn hàng mỗi trang
  totalMembership: number = 0;  //tổng số đơn hàng trong hệ thống
  showCreateMembershipModal: boolean = false;
  searchQuery: string = '';
  sortBy: string='MbsType';
  sortOrder: 'asc' | 'desc' = 'asc';
  isEditing: { [key: string]: boolean } = {};
  originalMembership: { [key: string]: Membership } = {};
  newMembership: CreateMembership = {
    MbsType: '', // Đảm bảo có thuộc tính này
    MinimumPaid: 0
  };
  


  constructor(
    private membershipService: MembershipApiService,
  ) { }

  ngOnInit(): void {
    this.loadMembership();
  }

  get totalPages(): number {
    return Math.ceil(this.totalMembership / this.pageSize);
  }
  // load dữ liệu từ API
  loadMembership(): void {
    this.membershipService.getMembership(this.currentPage, this.pageSize, this.searchQuery, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        if (!data || !Array.isArray(data.data)) {
          console.error('Invalid API response:', data);
          alert('Invalid data received from API');
          return;
        }
        this.memberships = data.data.map(membership => ({
          ...membership,
        }));
        this.memberships = data.data;
        this.totalMembership = data.total;
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
    this.loadMembership();
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
    this.loadMembership();
  }

  // tạo mới membership
  openCreateMembershipModal() {
    this.showCreateMembershipModal = true;
  }

  closeCreateMembershipModal() {
    this.showCreateMembershipModal = false;
    this.resetNewMembership();
  }

  resetNewMembership() {
    this.newMembership = {
      MbsType: '',
      MinimumPaid: 0,
    };
  }

  createMembership() {
    // Kiểm tra nếu bất kỳ trường nào bị bỏ trống
    if (
      this.newMembership.MbsType === null ||
      this.newMembership.MinimumPaid === null
    ) {
      alert('Vui lòng nhập đầy đủ tất cả thông tin!');
      return;
    }

    // Kiểm tra các giá trị không được âm
    if (
      this.newMembership.MinimumPaid < 0
    ) {
      alert('MinimumPaid không được là số âm!');
      return;
    }

    this.membershipService.createMembership({ ...this.newMembership }).subscribe({
      next: () => {
        alert('Membership created successfully!');
        this.closeCreateMembershipModal();
        this.loadMembership();
      },
      error: (err) => {
        console.error('API error:', err);
        alert('Failed to create Membership. Please try again.');
      }
    });
  }


  // Xóa membership
  deleteMembership(membership: Membership) {
    if (!membership || !membership._id) {
      console.error('Error: membership._id is undefined', membership);
      alert('Không tìm thấy ID của membership để xóa.');
      return;
    }

    console.log('Deleting membership with _id:', membership._id);

    if (!confirm('Bạn có chắc chắn muốn xóa membership này không?')) {
      return;
    }

    this.membershipService.deleteMembership(membership._id).subscribe({
      next: () => {
        alert('Membership deleted successfully!');
        this.loadMembership();
      },
      error: (err) => {
        console.error('API error:', err);
        alert(`Failed to delete membership. Error: ${err.message}`);
      }
    });
  }


  // Cập nhật membership
  // Bắt đầu chỉnh sửa
  startEditing(membershipID: string) {
    const membership = this.memberships.find(b => b._id === membershipID);
    if (membership) {
      this.originalMembership[membershipID] = { ...membership }; // Lưu bản sao dữ liệu gốc
    }
    this.isEditing[membershipID] = true;
  }
  
  // Lưu cập nhật
  saveMembership(membership: Membership) {
    if (!membership._id) {
      console.error('Error: membership._id is undefined', membership);
      alert('Không tìm thấy ID của membership để cập nhật.');
      return;
    }
    if (
      membership.MbsType === null ||
      membership.MinimumPaid === null
    ) {
      alert('Vui lòng nhập đầy đủ tất cả thông tin!');
      return;
    }

    // Kiểm tra các giá trị không âm
    if (
      membership.MinimumPaid < 0
    ) {
      alert('MinimumPaid không được là số âm!');
      return;
    }

    console.log('Updating membership with _id:', membership._id); // Kiểm tra ID trước khi gọi API
    // Tạo một đối tượng mới mà không có trường `_id`
    const { _id, ...updateData } = membership;

    this.membershipService.updateMembership(_id, updateData).subscribe({
      next: () => {
        alert('Membership updated successfully!');
        this.isEditing[membership._id] = false; // Tắt chế độ chỉnh sửa
        this.loadMembership(); // Refresh dữ liệu
      },
      error: (err) => {
        console.error('API error:', err);
        alert(`Failed to update membership. Error: ${err.message}`);
      }
    });
  }
 
  cancelEditing(membershipID: string) {
    if (this.originalMembership[membershipID]) {
      // Tạo một bản sao mới để Angular nhận diện sự thay đổi
      this.memberships = this.memberships.map(membership =>
        membership._id === membershipID ? { ...this.originalMembership[membershipID] } : membership
      );
    }
    // Xóa bản sao sau khi khôi phục
    delete this.originalMembership[membershipID];
    this.isEditing[membershipID] = false;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadMembership();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadMembership();
    }
  }
}
