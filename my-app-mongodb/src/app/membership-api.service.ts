import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Membership } from './classes/Membership';

@Injectable({
  providedIn: 'root'
})
export class MembershipApiService {
private apiUrl = 'http://localhost:3000/memberships';

  constructor(private http: HttpClient) { }

  getMembership(page: number, pageSize: number, search?: string, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Observable<{ data: Membership[]; total: number }> {
    const params: any = { page: page.toString(), limit: pageSize.toString() };
    
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;  
    if (sortOrder) params.sortOrder = sortOrder; 
    return this.http.get<{ data: Membership[]; total: number }>(this.apiUrl, { params }).pipe(
      retry(3),
      catchError(error => this.handleError(error))
    );
  }
  getMembershipById(membershipID: string): Observable<Membership> {
    return this.http.get<Membership>(`API_URL/memberships/${membershipID}`).pipe(

      catchError((error) => {
        console.error('Get error:', error);
        return throwError(() => new Error('Failed to get membership'));
      })
    );
  }
  createMembership(membershipData: Membership): Observable<Membership> {
    return this.http.post<Membership>(this.apiUrl, membershipData).pipe(
      catchError(error => this.handleError(error))
    );
  }
  updateMembership(membershipID: string, membershipData: Membership): Observable<Membership> {
    return this.http.patch<Membership>(`${this.apiUrl}/${membershipID}`, membershipData).pipe(
      catchError(error => this.handleError(error))
    );
  }
  deleteMembership(membershipID: string): Observable<Membership> {
    const deleteUrl = `${this.apiUrl}/${membershipID}`;
    console.log('Calling DELETE API:', deleteUrl); // Kiểm tra URL trước khi gọi API
    return this.http.delete<Membership>(deleteUrl).pipe(
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
