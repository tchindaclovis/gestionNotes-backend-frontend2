import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private readonly API_URL = 'http://localhost:8083/api';

  constructor(private http: HttpClient) {}

  // Génération de relevé individuel
  generateTranscript(studentId: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/pdf/transcript/${studentId}`, {
      responseType: 'blob'
    });
  }

  // Génération de relevés en masse
  generateBulkTranscripts(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/pdf/bulk-transcripts`, {
      responseType: 'blob'
    });
  }

  // Téléchargement du fichier PDF
  downloadPdf(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}