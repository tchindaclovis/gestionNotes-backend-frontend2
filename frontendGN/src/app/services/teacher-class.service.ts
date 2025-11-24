import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface TeacherClassAssignment {
  id?: number;
  teacherIdNum: string;
  classId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherClassService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  assignTeacherToClass(assignment: TeacherClassAssignment): Observable<any> {
    return this.http.post(`${this.API_URL}/teacher-classes/assign`, assignment, { headers: this.getAuthHeaders() });
  }

  getTeacherClasses(teacherIdNum: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/teacher-classes/teacher/${teacherIdNum}`, { headers: this.getAuthHeaders() });
  }

  unassignTeacherFromClass(teacherIdNum: string, classId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/teacher-classes/unassign/teacher/${teacherIdNum}/class/${classId}`, { headers: this.getAuthHeaders() });
  }
}