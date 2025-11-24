import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Grade {
  id: number;
  value: number;
  coefficient: number;
  date: string;
  studentId: number;
  subjectId: number;
  teacherId: number;
  subjectName?: string;
  studentName?: string;
  comment?: string;
}

export interface GradeStats {
  average: number;
  min: number;
  max: number;
  count: number;
  subjectName: string;
}

export interface Subject {
  id: number;
  name: string;
  subjectCode: string;
  coefficient: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  // === CONFIGURATION ===
  private readonly API_URL = 'http://localhost:8083/api';

  constructor(private http: HttpClient) {}

  // === MÉTHODES DE RÉCUPÉRATION DES DONNÉES ===
  
  /**
   * Récupère toutes les notes d'un étudiant
   */
  getStudentGrades(studentIdNum: string): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.API_URL}/grades/student/${studentIdNum}`);
  }

  /**
   * Calcule les statistiques d'un étudiant (moyennes, min, max par matière)
   */
  getStudentStats(studentIdNum: string): Observable<GradeStats[]> {
    return this.getStudentGrades(studentIdNum).pipe(
      map(grades => this.calculateStatsFromGrades(grades))
    );
  }

  // === MÉTHODES DE GESTION DES NOTES ===
  
  /**
   * Crée une nouvelle note
   */
  createGrade(grade: Partial<Grade>): Observable<Grade> {
    return this.http.post<Grade>(`${this.API_URL}/grades/add`, grade);
  }

  /**
   * Met à jour une note existante
   */
  updateGrade(gradeId: number, grade: Partial<Grade>): Observable<Grade> {
    return this.http.put<Grade>(`${this.API_URL}/grades/${gradeId}`, grade);
  }

  /**
   * Supprime une note
   */
  deleteGrade(gradeId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/grades/${gradeId}`);
  }

  // === MÉTHODES AUXILIAIRES ===
  
  /**
   * Récupère la liste de toutes les matières
   */
  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.API_URL}/subjects`);
  }

  /**
   * Crée une nouvelle matière
   */
  createSubject(subject: Partial<Subject>): Observable<Subject> {
    return this.http.post<Subject>(`${this.API_URL}/subjects`, subject);
  }

  /**
   * Met à jour une matière existante
   */
  updateSubject(subjectCode: string, subject: Partial<Subject>): Observable<Subject> {
    return this.http.put<Subject>(`${this.API_URL}/subjects/${subjectCode}`, subject);
  }

  // === MÉTHODES PRIVÉES DE CALCUL ===
  
  /**
   * Calcule les statistiques à partir d'une liste de notes
   * Groupe par matière et calcule moyenne, min, max, nombre de notes
   */
  private calculateStatsFromGrades(grades: Grade[]): GradeStats[] {
    // Groupement des notes par matière
    const subjectGroups = grades.reduce((acc, grade) => {
      const subject = grade.subjectName || 'Matière inconnue';
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(grade.value);
      return acc;
    }, {} as { [key: string]: number[] });

    // Calcul des statistiques pour chaque matière
    return Object.entries(subjectGroups).map(([subjectName, values]) => {
      if (values.length === 0) {
        return {
          subjectName,
          average: 0,
          min: 0,
          max: 0,
          count: 0
        };
      }
      
      return {
        subjectName,
        average: Math.round((values.reduce((sum, val) => sum + val, 0) / values.length) * 100) / 100,
        min: values.length > 0 ? Math.min(...values) : 0,
        max: values.length > 0 ? Math.max(...values) : 0,
        count: values.length
      };
    });
  }


}