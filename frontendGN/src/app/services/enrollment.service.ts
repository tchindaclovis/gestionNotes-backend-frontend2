// Imports Angular pour les services HTTP
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Interface représentant une inscription d'étudiant
 */
export interface Enrollment {
  id: number;              // Identifiant unique de l'inscription
  studentId: number;       // ID de l'étudiant
  classId: number;         // ID de la classe
  subjectId: number;       // ID de la matière
  enrollmentDate: string;  // Date d'inscription
  academicYear: string;    // Année académique
  semester: string;        // Semestre
}

/**
 * Interface pour les requêtes de création d'inscription
 */
export interface EnrollmentRequest {
  studentIdNum: string;    // Numéro d'étudiant
  classId: number;         // ID de la classe
  subjectId: number;       // ID de la matière
  academicYear: string;    // Année académique
  semester: string;        // Semestre
}

/**
 * Service pour gérer les inscriptions des étudiants
 * Permet d'inscrire des étudiants à des classes et matières
 */
@Injectable({
  providedIn: 'root' // Service singleton
})
export class EnrollmentService {
  // URL de base de l'API backend
  private readonly API_URL = 'http://localhost:8083/api';

  /**
   * Constructeur - Injection du client HTTP
   */
  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les inscriptions
   * @returns Observable contenant la liste des inscriptions
   */
  getAllEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.API_URL}/enrollments`)
      .pipe(catchError(() => []));
  }

  /**
   * Récupère une inscription par son ID
   * @param id - Identifiant de l'inscription
   * @returns Observable contenant l'inscription
   */
  getEnrollmentById(id: number): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.API_URL}/enrollments/${id}`)
      .pipe(catchError(() => ({} as Enrollment)));
  }

  /**
   * Récupère toutes les inscriptions d'un étudiant
   * @param studentIdNum - Numéro de l'étudiant
   * @returns Observable contenant les inscriptions de l'étudiant
   */
  getEnrollmentsByStudent(studentIdNum: string): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.API_URL}/enrollments/student/${studentIdNum}`)
      .pipe(catchError(() => []));
  }

  /**
   * Crée une nouvelle inscription
   * @param enrollmentData - Données de l'inscription à créer
   * @returns Observable contenant l'inscription créée
   */
  createEnrollment(enrollmentData: EnrollmentRequest): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.API_URL}/enrollments`, enrollmentData)
      .pipe(catchError(() => ({} as Enrollment)));
  }

  /**
   * Supprime une inscription
   * @param id - Identifiant de l'inscription à supprimer
   * @returns Observable vide
   */
  deleteEnrollment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/enrollments/${id}`)
      .pipe(catchError(() => undefined));
  }
}