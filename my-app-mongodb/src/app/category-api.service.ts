import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Category } from './classes/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {
private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) { }

  getCategory(page: number, pageSize: number, search?: string, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Observable<{ data: Category[]; total: number }> {
    const params: any = { page: page.toString(), limit: pageSize.toString() };
    
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;  
    if (sortOrder) params.sortOrder = sortOrder; 

    return this.http.get<{ data: Category[]; total: number }>(this.apiUrl, { params }).pipe(
      retry(3),
      catchError(error => this.handleError(error))
    );
  }
  getCategoryById(categoryID: string): Observable<Category> {
    return this.http.get<Category>(`API_URL/categories/${categoryID}`).pipe(

      catchError((error) => {
        console.error('Get error:', error);
        return throwError(() => new Error('Failed to get category'));
      })
    );
  }
  createCategory(categoryData: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, categoryData).pipe(
      catchError(error => this.handleError(error))
    );
  }
  updateCategory(categoryID: string, categoryData: Category): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${categoryID}`, categoryData).pipe(
      catchError(error => this.handleError(error))
    );
  }
  deleteCategory(categoryID: string): Observable<Category> {
    const deleteUrl = `${this.apiUrl}/${categoryID}`;
    console.log('Calling DELETE API:', deleteUrl); // Kiểm tra URL trước khi gọi API
    return this.http.delete<Category>(deleteUrl).pipe(
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
