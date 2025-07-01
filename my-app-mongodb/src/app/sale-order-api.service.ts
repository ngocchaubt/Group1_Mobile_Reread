import { Injectable } from '@angular/core';
import { SaleOrder } from './classes/SaleOrder';
import { catchError, map, Observable, retry, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SaleOrderAPIService {
  private apiUrl = 'http://localhost:3000/saleorders';

  constructor(private http: HttpClient) {}

  getSaleOrder(page: number, pageSize: number, search?: string, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Observable<{ data: SaleOrder[]; total: number }> {
    const params: any = { page: page.toString(), limit: pageSize.toString() };
    
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;  
    if (sortOrder) params.sortOrder = sortOrder; 

    return this.http.get<{ data: SaleOrder[]; total: number }>(this.apiUrl, { params }).pipe(
        retry(3),  // Chỉ cần một lần retry
        catchError(error => this.handleError(error))
    );
}

  
  getSaleOrderById(orderId: string): Observable<SaleOrder> {
    return this.http.get<SaleOrder>(`${this.apiUrl}/${orderId}`).pipe(
      catchError((error) => {
        console.error('Get error:', error);
        return throwError(() => new Error('Failed to get sale order'));
      })
    );
  }
  
  createSaleOrder(orderData: SaleOrder): Observable<SaleOrder> {
    return this.http.post<SaleOrder>(this.apiUrl, orderData).pipe(
      catchError(error => this.handleError(error))
    );
  }

  updateSaleOrder(orderId: string, updatedStatus: { OrderStatus: string }) {
    return this.http.patch(`${this.apiUrl}/${orderId}`, updatedStatus).pipe(
      catchError(error => this.handleError(error))
    );}


  private handleError(error: any): Observable<never> {
    const errorMessage =
      error?.error?.message ||
      (error.status === 413
        ? 'Payload quá lớn, vui lòng thử lại với dữ liệu nhỏ hơn.'
        : 'Đã xảy ra lỗi không xác định.');
    return throwError(() => new Error(errorMessage));
  }
}
