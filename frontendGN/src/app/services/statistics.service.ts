import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalSubjects: number;
  totalClasses: number;
  totalUsers: number;
}

export interface GradeStats {
  globalAverage: number;
  totalGrades: number;
}

export interface PerformanceStats {
  successRate: number;
  studentsAbove10: number;
  totalStudentsWithGrades: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly API_URL = environment.apiUrl + '/statistics';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/dashboard`, { headers: this.getAuthHeaders() });
  }

  getGradeStats(): Observable<GradeStats> {
    return this.http.get<GradeStats>(`${this.API_URL}/grades`, { headers: this.getAuthHeaders() });
  }

  getPerformanceStats(): Observable<PerformanceStats> {
    return this.http.get<PerformanceStats>(`${this.API_URL}/performance`, { headers: this.getAuthHeaders() });
  }
}