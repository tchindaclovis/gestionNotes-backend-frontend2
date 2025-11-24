import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserResponse, StudentRequest, TeacherRequest } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Récupère tous les utilisateurs
   */
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.API_URL}/admin/users/users`, { headers: this.getAuthHeaders() });
  }
  
  /**
   * Récupère les étudiants pour les enseignants
   */
  getStudentsForTeacher(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.API_URL}/admin/users/students-list`, { headers: this.getAuthHeaders() });
  }

  /**
   * Récupère un utilisateur par son ID
   */
  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/admin/users/${id}`, { headers: this.getAuthHeaders() });
  }

  /**
   * Récupère un utilisateur par son nom d'utilisateur
   */
  getUserByUsername(username: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/admin/users/username/${username}`, { headers: this.getAuthHeaders() });
  }

  /**
   * Récupère un utilisateur par son email
   */
  getUserByEmail(email: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/admin/users/email/${email}`, { headers: this.getAuthHeaders() });
  }

  /**
   * Crée un nouvel étudiant
   */
  createStudent(student: StudentRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API_URL}/admin/users/students`, student, { headers: this.getAuthHeaders() });
  }

  /**
   * Crée un nouvel enseignant
   */
  createTeacher(teacher: TeacherRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API_URL}/admin/users/teachers`, teacher, { headers: this.getAuthHeaders() });
  }

  /**
   * Met à jour un utilisateur
   */
  updateUser(id: number, user: any): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.API_URL}/admin/users/update/${id}`, user, { headers: this.getAuthHeaders() });
  }

  /**
   * Supprime un utilisateur
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/admin/users/delete/${id}`, { headers: this.getAuthHeaders() });
  }
}