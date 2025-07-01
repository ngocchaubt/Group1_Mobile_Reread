import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Event } from './classes/Event';

@Injectable({
  providedIn: 'root'
})
export class EventApiService {

  private apiUrl = 'http://localhost:3000/events';

  constructor(private http: HttpClient) {}

  getEvent(page: number, pageSize: number, search?: string, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Observable<{ data: Event[]; total: number }> {
    const params: any = { page: page.toString(), limit: pageSize.toString() };
    
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;  
    if (sortOrder) params.sortOrder = sortOrder; 

    return this.http.get<{ data: Event[]; total: number }>(this.apiUrl, { params }).pipe(
      retry(3),
      catchError(error => this.handleError(error))
    );

  }
  getEventById(eventID: string): Observable<Event> {
    return this.http.get<Event>(`API_URL/events/${eventID}`).pipe(

      catchError((error) => {
        console.error('Get error:', error);
        return throwError(() => new Error('Failed to get event'));
      })
    );
  }
  createEvent(eventData: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, eventData).pipe(
      catchError(error => this.handleError(error))
    );
  }
  updateEvent(eventID: string, eventData: Event): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${eventID}`, eventData).pipe(
        catchError(error => this.handleError(error))
    );
}
  private handleError(error: HttpErrorResponse): Observable<never> {
    
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
