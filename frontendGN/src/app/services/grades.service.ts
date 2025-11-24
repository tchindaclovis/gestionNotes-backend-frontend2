import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GradeRequest } from '../models/grade.model';
import { environment } from '../../environments/environment';

export interface GradeResponse {
  id: number;
  value: number;
  coefficient: number;
  date: string;
  comment?: string;
  studentIdNum: string;
  subjectCode: string;
  recordedBy?: string;
  studentName?: string;
  subjectName?: string;
  teacherName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Crée une nouvelle note
   */
  addGrade(grade: GradeRequest): Observable<GradeResponse> {
    return this.http.post<GradeResponse>(`${this.API_URL}/grades/add`, grade);
  }

  /**
   * Récupère une note par son ID
   */
  getGradeById(id: number): Observable<GradeResponse> {
    return this.http.get<GradeResponse>(`${this.API_URL}/grades/${id}`);
  }

  /**
   * Récupère toutes les notes
   */
  getAllGrades(): Observable<GradeResponse[]> {
    return this.http.get<GradeResponse[]>(`${this.API_URL}/grades`);
  }

  /**
   * Récupère les notes d'un étudiant
   */
  getGradesByStudentId(studentIdNum: string): Observable<GradeResponse[]> {
    return this.http.get<GradeResponse[]>(`${this.API_URL}/grades/student/${studentIdNum}`);
  }

  /**
   * Récupère les notes d'une matière
   */
  getGradesBySubjectCode(subjectCode: string): Observable<GradeResponse[]> {
    return this.http.get<GradeResponse[]>(`${this.API_URL}/grades/subject/${subjectCode}`);
  }

  /**
   * Récupère les notes d'un étudiant pour une matière
   */
  getGradesByStudentAndSubject(studentIdNum: string, subjectCode: string): Observable<GradeResponse[]> {
    return this.http.get<GradeResponse[]>(`${this.API_URL}/grades/student/${studentIdNum}/subject/${subjectCode}`);
  }

  /**
   * Met à jour une note
   */
  updateGrade(id: number, grade: GradeRequest): Observable<GradeResponse> {
    return this.http.put<GradeResponse>(`${this.API_URL}/grades/${id}`, grade);
  }

  /**
   * Supprime une note
   */
  deleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/grades/${id}`);
  }

  /**
   * Calcule la moyenne d'un étudiant pour une matière
   */
  getStudentAverageForSubject(studentIdNum: string, subjectCode: string): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/grades/averages/student/${studentIdNum}/subject/${subjectCode}`);
  }

  /**
   * Calcule la moyenne générale d'un étudiant
   */
  getStudentOverallAverage(studentIdNum: string): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/grades/averages/student/overall/${studentIdNum}`);
  }

  /**
   * Calcule la moyenne d'une matière
   */
  getSubjectAverage(subjectCode: string): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/grades/averages/subject/${subjectCode}`);
  }
}