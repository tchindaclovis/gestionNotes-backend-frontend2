import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  timestamp: string;
  read: boolean;
}

export interface ConversationPartner {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageApiService {
  private readonly API_URL = environment.apiUrl + '/messages';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  sendMessage(receiverId: number, content: string): Observable<Message> {
    return this.http.post<Message>(this.API_URL, { receiverId, content }, { headers: this.getAuthHeaders() });
  }

  getConversation(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.API_URL}/conversation/${userId}`, { headers: this.getAuthHeaders() });
  }

  getConversationPartners(): Observable<ConversationPartner[]> {
    return this.http.get<ConversationPartner[]>(`${this.API_URL}/partners`, { headers: this.getAuthHeaders() });
  }
}