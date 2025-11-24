import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  log(message: string, data?: any): void {
    if (!environment.production) {
      console.log(this.sanitizeLogMessage(message), data ? this.sanitizeData(data) : '');
    }
  }

  error(message: string, error?: any): void {
    if (!environment.production) {
      console.error(this.sanitizeLogMessage(message), error ? this.sanitizeData(error) : '');
    }
  }

  warn(message: string, data?: any): void {
    if (!environment.production) {
      console.warn(this.sanitizeLogMessage(message), data ? this.sanitizeData(data) : '');
    }
  }

  private sanitizeLogMessage(message: string): string {
    if (!message) return '';
    // Supprimer les caractères de contrôle et les retours à la ligne
    return message.replace(/[\r\n\t]/g, ' ').substring(0, 500);
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeLogMessage(data);
    }
    if (typeof data === 'object' && data !== null) {
      // Masquer les données sensibles
      const sanitized = { ...data };
      const sensitiveFields = ['password', 'token', 'secret', 'key', 'credential'];
      
      for (const field of sensitiveFields) {
        if (sanitized[field]) {
          sanitized[field] = '[MASKED]';
        }
      }
      return sanitized;
    }
    return data;
  }
}