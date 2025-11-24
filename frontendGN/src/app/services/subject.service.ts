import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject, SubjectRequest } from '../models/grade.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found');
      throw new Error('Authentication required');
    }
    console.log('Using token:', token.substring(0, 20) + '...');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Récupère toutes les matières
   */
  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.API_URL}/subjects`, { headers: this.getAuthHeaders() });
  }

  /**
   * Récupère une matière par son code
   */
  getSubjectByCode(subjectCode: string): Observable<Subject> {
    return this.http.get<Subject>(`${this.API_URL}/subjects/${subjectCode}`);
  }

  /**
   * Récupère une matière par son nom
   */
  getSubjectByName(name: string): Observable<Subject> {
    return this.http.get<Subject>(`${this.API_URL}/subjects/name/${name}`);
  }

  /**
   * Crée une nouvelle matière
   */
  createSubject(subject: SubjectRequest): Observable<Subject> {
    console.log('Creating subject with data:', subject);
    console.log('User authenticated:', this.authService.isAuthenticated());
    console.log('Current user:', this.authService.getCurrentUser());
    return this.http.post<Subject>(`${this.API_URL}/subjects`, subject, { headers: this.getAuthHeaders() });
  }

  /**
   * Met à jour une matière existante
   */
  updateSubject(subjectCode: string, subject: SubjectRequest): Observable<Subject> {
    return this.http.put<Subject>(`${this.API_URL}/subjects/${subjectCode}`, subject, { headers: this.getAuthHeaders() });
  }

  /**
   * Supprime une matière
   */
  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/subjects/${id}`);
  }
}