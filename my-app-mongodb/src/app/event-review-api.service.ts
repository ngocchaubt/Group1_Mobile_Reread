import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { EventReview } from './classes/EventReview';

@Injectable({
  providedIn: 'root'
})
export class EventReviewApiService {
private apiUrl = 'http://localhost:3000/eventreviews';
  constructor(private http: HttpClient) { }

  getEventReview(page: number, pageSize: number, search?: string, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Observable<{ data: EventReview[]; total: number }> {
    const params: any = { page: page.toString(), limit: pageSize.toString() };
    
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;  
    if (sortOrder) params.sortOrder = sortOrder; 
    return this.http.get<{ data: EventReview[]; total: number }>(this.apiUrl, { params }).pipe(
      retry(3),
      catchError(error => this.handleError(error))
    );
  }
  getEventReviewById(eventreviewID: string): Observable<EventReview> {
  return this.http.get<EventReview>(`${this.apiUrl}/${eventreviewID}`).pipe(
    catchError((error) => {
      console.error('Get error:', error);
      return throwError(() => new Error('Failed to get eventreviews'));
    })
  );
}

  deleteEventReview(eventreviewID: string): Observable<EventReview> {
    const deleteUrl = `${this.apiUrl}/${eventreviewID}`;
    console.log('Calling DELETE API:', deleteUrl); // Kiểm tra URL trước khi gọi API
    return this.http.delete<EventReview>(deleteUrl).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<never> {

    console.log('Error status:', error.status); // Kiểm tra status code
    console.log('Error response:', error.error); // Kiểm tra response từ server

    const errorMessage =
      error?.error?.message ||
      (error.status === 413
        ? 'Payload quá lớn, vui lòng thử lại với dữ liệu nhỏ hơn.'
        : `Lỗi không xác định: ${error.status}`);

    return throwError(() => new Error(errorMessage));
  }
  
}
