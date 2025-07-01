import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { BookReview } from './classes/BookReivew';

@Injectable({
  providedIn: 'root'
})
export class BookReviewApiService {
  private apiUrl = 'http://localhost:3000/bookreviews';
  constructor(private http: HttpClient) { }

  getBookReview(page: number, pageSize: number, search?: string, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Observable<{ data: BookReview[]; total: number }> {
    const params: any = { page: page.toString(), limit: pageSize.toString() };
    
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;  
    if (sortOrder) params.sortOrder = sortOrder; 

    return this.http.get<{ data: BookReview[]; total: number }>(this.apiUrl, { params }).pipe(
      retry(3),
      catchError(error => this.handleError(error))
    );
  }
  getBookReviewById(bookreviewID: string): Observable<BookReview> {
    return this.http.get<BookReview>(`API_URL/bookreviews/${bookreviewID}`).pipe(

      catchError((error) => {
        console.error('Get error:', error);
        return throwError(() => new Error('Failed to get bookreviews'));
      })
    );
  }
  deleteBookReview(bookreviewID: string): Observable<BookReview> {
    const deleteUrl = `${this.apiUrl}/${bookreviewID}`;
    console.log('Calling DELETE API:', deleteUrl); // Kiểm tra URL trước khi gọi API
    return this.http.delete<BookReview>(deleteUrl).pipe(
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
