// Imports Angular pour les services HTTP
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Service pour gérer l'export de données en différents formats
 * Permet d'exporter les données de l'application (notes, utilisateurs, etc.)
 */
@Injectable({
  providedIn: 'root' // Service singleton
})
export class ExportService {
  // URL de base de l'API backend
  private readonly API_URL = environment.apiUrl;

  /**
   * Constructeur - Injection du client HTTP
   */
  constructor(private http: HttpClient) {}

  /**
   * Exporte toutes les notes en format Excel
   * @returns Observable contenant le fichier Excel sous forme de Blob
   */
  exportGradesToExcel(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/exports/grades/excel`, {
      responseType: 'blob' // Réponse en format binaire pour le fichier Excel
    });
  }

  /**
   * Déclenche le téléchargement d'un fichier Excel
   * @param blob - Contenu du fichier Excel
   * @param filename - Nom du fichier (par défaut: rapport_notes.xlsx)
   */
  downloadExcel(blob: Blob, filename: string = 'rapport_notes.xlsx'): void {
    // Création d'une URL temporaire pour le blob
    const url = window.URL.createObjectURL(blob);
    
    // Création d'un lien de téléchargement invisible
    const link = document.createElement('a');
    link.href = url;
    link.download = filename; // Nom du fichier
    
    // Déclenchement du téléchargement
    link.click();
    
    // Nettoyage de l'URL temporaire
    window.URL.revokeObjectURL(url);
  }
}