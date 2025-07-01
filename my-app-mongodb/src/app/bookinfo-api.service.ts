import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { BookInfo } from './classes/BookInfo';

@Injectable({
  providedIn: 'root'
})
export class BookinfoApiService {
private apiUrl = 'http://localhost:3000/bookinfo';

  constructor(private http: HttpClient) { }

  getBookInfo(page: number, pageSize: number, search?: string, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Observable<{ data: BookInfo[]; total: number }> {
    const params: any = { page: page.toString(), limit: pageSize.toString() };
    
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;  
    if (sortOrder) params.sortOrder = sortOrder;

    return this.http.get<{ data: BookInfo[]; total: number }>(this.apiUrl, { params }).pipe(
      retry(3),
      catchError(error => this.handleError(error))
    );
  }
  getBookInfoById(bookinfoID: string): Observable<BookInfo> {
    return this.http.get<BookInfo>(`API_URL/bookinfo_s/${bookinfoID}`).pipe(

      catchError((error) => {
        console.error('Get error:', error);
        return throwError(() => new Error('Failed to get bookinfo'));
      })
    );
  }
  createBookInfo(bookinfoData: BookInfo): Observable<BookInfo> {
    return this.http.post<BookInfo>(this.apiUrl, bookinfoData).pipe(
      catchError(error => this.handleError(error))
    );
  }
  updateBookInfo(bookinfoID: string, bookinfoData: BookInfo): Observable<BookInfo> {
    return this.http.patch<BookInfo>(`${this.apiUrl}/${bookinfoID}`, bookinfoData).pipe(
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
