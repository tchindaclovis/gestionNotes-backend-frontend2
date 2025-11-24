import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ApiNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationApiService {
  private readonly API_URL = environment.apiUrl + '/notifications';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createNotification(notification: { title: string; message: string; type: string }): Observable<ApiNotification> {
    return this.http.post<ApiNotification>(this.API_URL, notification, { headers: this.getAuthHeaders() });
  }

  getUserNotifications(): Observable<ApiNotification[]> {
    return this.http.get<ApiNotification[]>(this.API_URL, { headers: this.getAuthHeaders() });
  }

  getUnreadNotifications(): Observable<ApiNotification[]> {
    return this.http.get<ApiNotification[]>(`${this.API_URL}/unread`, { headers: this.getAuthHeaders() });
  }

  markAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}/read`, {}, { headers: this.getAuthHeaders() });
  }

  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/read-all`, {}, { headers: this.getAuthHeaders() });
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/count`, { headers: this.getAuthHeaders() });
  }
}