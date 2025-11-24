import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div class="notification-trigger" (click)="toggleNotifications()">
        <div class="notification-icon">
          🔔
          <span *ngIf="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
        </div>
      </div>

      <div *ngIf="showNotifications" class="notifications-panel">
        <div class="panel-header">
          <h3>Notifications</h3>
          <button *ngIf="unreadCount > 0" (click)="markAllAsRead()" class="mark-all-read">
            Tout marquer comme lu
          </button>
        </div>

        <div class="notifications-list">
          <div *ngFor="let notification of notifications" 
               class="notification-item"
               [class.unread]="!notification.read"
               (click)="markAsRead(notification.id)">
            
            <div class="notification-content">
              <h4 class="notification-title">{{ notification.title }}</h4>
              <p class="notification-message">{{ notification.message }}</p>
              <span class="notification-time">{{ getTimeAgo(notification.timestamp) }}</span>
              <button *ngIf="notification.type === 'info'" class="reply-btn" (click)="openChat(); $event.stopPropagation()">
                💬 Répondre
              </button>
            </div>

            <div *ngIf="!notification.read" class="unread-indicator"></div>
          </div>
        </div>
      </div>

      <div *ngIf="showNotifications" class="notifications-overlay" (click)="closeNotifications()"></div>
    </div>
  `,
  styles: [`
    .notifications-container { position: relative; }
    .notification-trigger { cursor: pointer; }
    .notification-icon { font-size: 1.5rem; position: relative; }
    .notification-badge { position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 600; }
    .notifications-panel { position: absolute; top: 100%; right: 0; width: 350px; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); z-index: 1000; }
    .panel-header { padding: 16px 20px; border-bottom: 1px solid #e0e7ff; display: flex; justify-content: space-between; }
    .notification-item { display: flex; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
    .notification-item.unread { background-color: #eff6ff; }
    .unread-indicator { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; }
    .notifications-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999; }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount = 0;
  showNotifications = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe((notifications: Notification[]) => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter((n: Notification) => !n.read).length;
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(diff / 86400000)}j`;
  }

  openChat(): void {
    // Fermer les notifications et signaler l'ouverture du chat
    this.closeNotifications();
    // Ici on pourrait émettre un événement pour ouvrir le chat
    console.log('Ouverture du chat depuis les notifications');
  }
}