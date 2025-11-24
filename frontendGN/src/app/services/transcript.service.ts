// Imports Angular pour les services HTTP
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Service pour gérer la génération de relevés de notes PDF
 * Communique avec l'API Spring Boot pour générer et télécharger les relevés
 */
@Injectable({
  providedIn: 'root' // Service singleton
})
export class TranscriptService {
  // URL de base de l'API backend
  private readonly API_URL = environment.apiUrl;

  /**
   * Constructeur - Injection du client HTTP
   */
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Génère un relevé de notes PDF pour un étudiant
   * @param studentIdNum - Numéro de l'étudiant
   * @returns Observable contenant le fichier PDF sous forme de Blob
   */
  generateStudentTranscript(studentIdNum: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/transcripts/student/${studentIdNum}`, {
      responseType: 'blob',
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Déclenche le téléchargement d'un relevé PDF
   * @param blob - Contenu du fichier PDF
   * @param studentIdNum - Numéro de l'étudiant (pour le nom du fichier)
   */
  downloadTranscript(blob: Blob, studentIdNum: string): void {
    // Création d'une URL temporaire pour le blob
    const url = window.URL.createObjectURL(blob);
    
    // Création d'un lien de téléchargement invisible
    const link = document.createElement('a');
    link.href = url;
    link.download = `releve_notes_${studentIdNum}.pdf`; // Nom du fichier
    
    // Déclenchement du téléchargement
    link.click();
    
    // Nettoyage de l'URL temporaire
    window.URL.revokeObjectURL(url);
  }
}