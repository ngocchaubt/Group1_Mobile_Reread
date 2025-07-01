import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Quotation } from './classes/Quotation';
import { Discount } from './classes/Discount';

@Injectable({
  providedIn: 'root'
})
export class QuotationApiService {
 private apiUrl = 'http://localhost:3000/quotations';

  constructor(private http: HttpClient) {}

  getQuotation(page: number, pageSize: number, search?: string, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Observable<{ data: Quotation[]; total: number }> {
    const params: any = { page: page.toString(), limit: pageSize.toString() };
    
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;  
    if (sortOrder) params.sortOrder = sortOrder;

    return this.http.get<{ data:  Quotation[]; total: number }>(this.apiUrl, { params }).pipe(
      retry(3),
      catchError(error => this.handleError(error))
    );
  }
 getQuotationById(quotationID: string): Observable< Quotation> {
    return this.http.get< Quotation>(`API_URL/quotations/${quotationID}`).pipe(

      catchError((error) => {
        console.error('Get error:', error);
        return throwError(() => new Error('Failed to get discount'));
      })
    );
  }
  updateQuotation(quotationId: string, updatedStatus: { QuotStatus: string }) {
    return this.http.patch(`${this.apiUrl}/${quotationId}`, updatedStatus).pipe(
      catchError(error => this.handleError(error))
    );}
  

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
