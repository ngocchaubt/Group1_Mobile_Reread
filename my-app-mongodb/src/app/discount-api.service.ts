import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Discount } from './classes/Discount';

@Injectable({
  providedIn: 'root'
})
export class DiscountApiService {
  private apiUrl = 'http://localhost:3000/discounts';

  constructor(private http: HttpClient) {}

  getDiscount(page: number, pageSize: number, search?: string, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Observable<{ data: Discount[]; total: number }> {
    const params: any = { page: page.toString(), limit: pageSize.toString() };
    
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;  
    if (sortOrder) params.sortOrder = sortOrder;

    return this.http.get<{ data: Discount[]; total: number }>(this.apiUrl, { params }).pipe(
      retry(3),
      catchError(error => this.handleError(error))
    );
  }
 getDiscountById(discountID: string): Observable<Discount> {
    return this.http.get<Discount>(`API_URL/discounts/${discountID}`).pipe(

      catchError((error) => {
        console.error('Get error:', error);
        return throwError(() => new Error('Failed to get discount'));
      })
    );
  }
  createDiscount(discountData: Discount): Observable<Discount> {
    return this.http.post<Discount>(this.apiUrl, discountData).pipe(
      catchError(error => this.handleError(error))
    );
  }
  updateDiscount(discountID: string, discountData: Discount): Observable<Discount> {
    return this.http.patch<Discount>(`${this.apiUrl}/${discountID}`, discountData).pipe(
        catchError(error => this.handleError(error))
    );
}
  deleteDiscount(discountID: string): Observable<Discount> {
    const deleteUrl = `${this.apiUrl}/${discountID}`;
    console.log('Calling DELETE API:', deleteUrl); // Kiểm tra URL trước khi gọi API
    return this.http.delete<Discount>(deleteUrl).pipe(
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
