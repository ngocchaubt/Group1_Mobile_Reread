import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { BookStock } from './classes/BookStock';

@Injectable({
  providedIn: 'root'
})
export class BookStockApiService {
  private apiUrl = 'http://localhost:3000/bookstocks';

  constructor(private http: HttpClient) { }

  getBookStock(page: number, pageSize: number, search?: string, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Observable<{ data: BookStock[]; total: number }> {
    const params: any = { page: page.toString(), limit: pageSize.toString() };
    
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;  
    if (sortOrder) params.sortOrder = sortOrder;

    return this.http.get<{ data: BookStock[]; total: number }>(this.apiUrl, { params }).pipe(
      retry(3),
      catchError(error => this.handleError(error))
    );
  }

  getBookStockById(bookstockID: string): Observable<BookStock> {
    return this.http.get<BookStock>(`API_URL/bookstocks/${bookstockID}`).pipe(

      catchError((error) => {
        console.error('Get error:', error);
        return throwError(() => new Error('Failed to get bookstock'));
      })
    );
  }

  createBookStock(bookstockData: BookStock): Observable<BookStock> {
    return this.http.post<BookStock>(this.apiUrl, bookstockData).pipe(
      catchError(error => this.handleError(error))
    );
  }

  updateBookStock(bookstockID: string, bookstockData: BookStock): Observable<BookStock> {
    return this.http.patch<BookStock>(`${this.apiUrl}/${bookstockID}`, bookstockData).pipe(
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
