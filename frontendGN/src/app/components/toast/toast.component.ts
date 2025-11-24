import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let notification of toasts" 
           class="toast" 
           [ngClass]="'toast-' + notification.type">
        <div class="toast-icon">
          {{ getIcon(notification.type) }}
        </div>
        <div class="toast-content">
          <div class="toast-title">{{ notification.title }}</div>
          <div class="toast-message">{{ notification.message }}</div>
        </div>
        <button class="toast-close" (click)="closeToast(notification.id)">
          ✕
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: slideIn 0.3s ease-out;
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

    .toast-success {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .toast-error {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    }

    .toast-warning {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }

    .toast-info {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
    }

    .toast-icon {
      font-size: 1.5rem;
      margin-right: 12px;
      flex-shrink: 0;
    }

    .toast-content {
      flex: 1;
    }

    .toast-title {
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 4px;
    }

    .toast-message {
      font-size: 0.8rem;
      opacity: 0.9;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      opacity: 0.7;
      transition: opacity 0.2s;
      margin-left: 8px;
    }

    .toast-close:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class ToastComponent implements OnInit {
  toasts: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.toastNotifications$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  closeToast(id: string): void {
    this.notificationService.removeToast(id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  }
}