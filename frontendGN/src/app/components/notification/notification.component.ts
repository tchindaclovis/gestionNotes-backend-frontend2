import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService, ErrorMessage } from '../../services/error.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="currentError" 
         class="notification" 
         [class]="'notification-' + currentError.type">
      <div class="notification-content">
        <i class="fas" [class]="getIcon()"></i>
        <span>{{ currentError.message }}</span>
        <button class="notification-close" (click)="close()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
      min-width: 300px;
      max-width: 500px;
      border-radius: 0.5rem;
      box-shadow: var(--shadow-lg);
      animation: slideIn 0.3s ease-out;
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      color: white;
    }

    .notification-error {
      background-color: var(--error-color);
    }

    .notification-success {
      background-color: var(--success-color);
    }

    .notification-warning {
      background-color: var(--warning-color);
    }

    .notification-info {
      background-color: var(--info-color);
    }

    .notification-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0.25rem;
      margin-left: auto;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationComponent implements OnInit {
  currentError: ErrorMessage | null = null;

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.errorService.error$.subscribe({
      next: (error) => {
        this.currentError = error;
      },
      error: () => {
        // Gestion d'erreur silencieuse
      }
    });
  }

  close(): void {
    this.errorService.clear();
  }

  getIcon(): string {
    if (!this.currentError) return '';
    
    switch (this.currentError.type) {
      case 'error': return 'fa-exclamation-circle';
      case 'success': return 'fa-check-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info': return 'fa-info-circle';
      default: return 'fa-info-circle';
    }
  }
}