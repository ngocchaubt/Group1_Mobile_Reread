import { Component } from '@angular/core';
import { CreateEvent } from '../../classes/Event';
import { EventApiService } from '../../event-api.service';
import { Event } from '../../classes/Event';

@Component({
  selector: 'app-event',
  standalone: false,
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  events: Event[] = [];
  currentPage: number = 1;
  pageSize: number = 10; //số đơn hàng mỗi trang
  totalEvent: number = 0;  //tổng số đơn hàng trong hệ thống
  showCreateEventModal: boolean = false;
  searchQuery: string = '';
  sortBy: string='EventType';
  sortOrder: 'asc' | 'desc' = 'asc';
  isEditing: { [key: string]: boolean } = {};
  originalEvent: { [key: string]: Event } = {};
  newEvent: CreateEvent = {
    EventID: '',
    EventName: '',
    EventType: '',
    EventStart: '',
    EventEnd: '',
    EventDesc: [],
    EventLoc: '',
    EventCpct: 0,
    Img: ''
  };

  EventType : string[] = ["Art Show", "Competition","Workshop"]

  constructor(
    private eventService: EventApiService,
  ) { }

  ngOnInit(): void {
    this.loadEvent();
  }

  get totalPages(): number {
    return Math.ceil(this.totalEvent / this.pageSize);
  }
  // load dữ liệu từ API
  loadEvent(): void {
    this.eventService.getEvent(this.currentPage, this.pageSize, this.searchQuery, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        if (!data || !Array.isArray(data.data)) {
          console.error('Invalid API response:', data);
          alert('Invalid data received from API');
          return;
        }
        this.events = data.data.map(event => ({
          ...event,
        }));
        this.events = data.data;
        this.totalEvent = data.total;
      },
      error: (err) => {
        console.error('API error:', err);
        alert('An error occurred while loading events. Please try again.');
      }
    });
  }

  onSearch(): void {
    this.searchQuery = this.searchQuery.trim(); // Loại bỏ khoảng trắng đầu/cuối
     this.currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
    this.loadEvent();
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
    this.loadEvent();
  }


  // tạo mới Event
  openCreateEventModal() {
    this.showCreateEventModal = true;
  }

  closeCreateEventModal() {
    this.showCreateEventModal = false;
    this.resetNewEvent();
  }

  resetNewEvent() {
    this.newEvent = {
      EventID: '',
      EventName: '',
      EventType: '',
      EventStart: '',
      EventEnd: '',
      EventDesc: [],
      EventLoc: '',
      EventCpct: 0,
      Img: ''
    };
  }

  createEvent() {
    // Kiểm tra nếu bất kỳ trường nào bị bỏ trống
    if (
      !this.newEvent.EventID ||
      this.newEvent.EventName == null ||
      this.newEvent.EventType === null ||
      this.newEvent.EventStart.trim() == '' ||
      this.newEvent.EventEnd.trim() == '' ||
      this.newEvent.EventLoc == null ||
      this.newEvent.EventCpct == null ||
      this.newEvent.Img == null
    ) {
      alert('Vui lòng nhập đầy đủ tất cả thông tin!');
      return;
    }
    
    // Kiểm tra các giá trị không được âm
    if (
      this.newEvent.EventCpct < 0
    ) {
      alert('EventCpct không được là số âm!');
      return;
    }

    this.eventService.createEvent({ ...this.newEvent }).subscribe({
      next: () => {
        alert('Event created successfully!');
        this.closeCreateEventModal();
        this.loadEvent();
      },
      error: (err) => {
        console.error('API error:', err);
        alert('Failed to create event. Please try again.');
      }
    });
  }


  // Cập nhật Event
  // Bắt đầu chỉnh sửa
  startEditing(eventID: string) {
    const event = this.events.find(b => b._id === eventID);
    if (event) {
      this.originalEvent[eventID] = { ...event }; // Lưu bản sao dữ liệu gốc
    }
    this.isEditing[eventID] = true;
  }

  // Lưu cập nhật
  saveEvent(event: Event) {
    if (!event._id) {
      console.error('Error:event._id is undefined', event);
      alert('Không tìm thấy ID của event để cập nhật.');
      return;
    }
    if (
      event.EventName === null ||
      event.EventType === null ||
      event.EventStart.trim() === '' ||
      event.EventEnd.trim() === '' ||
      event.EventDesc === null ||
      event.EventLoc === null ||
      event.EventCpct === null ||
      event.Img === null
    ) {
      alert('Vui lòng nhập đầy đủ tất cả thông tin!');
      return;
    }

    // Kiểm tra các giá trị không âm
    if (
      event.EventCpct < 0
    ) {
      alert('EventCpct không được là số âm!');
      return;
    }

    console.log('Updating event with _id:', event._id); // Kiểm tra ID trước khi gọi API
    // Tạo một đối tượng mới mà không có trường `_id`
    const { _id, ...updateData } = event;
    
    this.eventService.updateEvent(_id, updateData).subscribe({
      next: () => {
        alert('Event updated successfully!');
        if (event._id) {
          this.isEditing[event._id] = false; // Tắt chế độ chỉnh sửa
        }        
        this.loadEvent(); // Refresh dữ liệu
      },
      error: (err) => {
        console.error('API error:', err);
        alert(`Failed to update Event. Error: ${err.message}`);
      }
    });
  }
  cancelEditing(eventID: string) {
    if (this.originalEvent[eventID]) {
      this.events = this.events.map(event => {
        if (event._id === eventID) {
          return this.originalEvent[eventID];
        }
        return event;
      });
    }
    this.isEditing[eventID] = false;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEvent();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEvent();
    }
  }
}
