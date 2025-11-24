import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ClassModel {
  id?: number;
  name: string;
  academicYear: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllClasses(): Observable<ClassModel[]> {
    return this.http.get<ClassModel[]>(`${this.API_URL}/classes`, { headers: this.getAuthHeaders() });
  }

  createClass(classData: ClassModel): Observable<ClassModel> {
    return this.http.post<ClassModel>(`${this.API_URL}/classes`, classData, { headers: this.getAuthHeaders() });
  }

  updateClass(id: number, classData: ClassModel): Observable<ClassModel> {
    return this.http.put<ClassModel>(`${this.API_URL}/classes/${id}`, classData, { headers: this.getAuthHeaders() });
  }

  deleteClass(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/classes/${id}`, { headers: this.getAuthHeaders() });
  }

  getClassesByTeacher(teacherIdNum: string): Observable<ClassModel[]> {
    return this.http.get<ClassModel[]>(`${this.API_URL}/classes/teacher/${teacherIdNum}`, { headers: this.getAuthHeaders() });
  }
}