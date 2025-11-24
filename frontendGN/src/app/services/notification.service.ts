import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
  autoClose?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  private toastNotifications = new BehaviorSubject<Notification[]>([]);
  public toastNotifications$ = this.toastNotifications.asObservable();

  constructor() {}

  // Ajouter une notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    // Ajouter à la liste des notifications
    const current = this.notifications.value;
    this.notifications.next([newNotification, ...current]);

    // Ajouter aux toasts si autoClose est activé
    if (newNotification.autoClose !== false) {
      this.showToast(newNotification);
    }
  }

  // Afficher un toast
  private showToast(notification: Notification): void {
    const currentToasts = this.toastNotifications.value;
    this.toastNotifications.next([...currentToasts, notification]);

    // Auto-suppression après durée spécifiée
    const duration = notification.duration || this.getDefaultDuration(notification.type);
    setTimeout(() => {
      this.removeToast(notification.id);
    }, duration);
  }

  // Supprimer un toast
  removeToast(id: string): void {
    const currentToasts = this.toastNotifications.value;
    this.toastNotifications.next(currentToasts.filter(n => n.id !== id));
  }

  // Marquer comme lu
  markAsRead(id: string): void {
    const current = this.notifications.value;
    const updated = current.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notifications.next(updated);
  }

  // Marquer toutes comme lues
  markAllAsRead(): void {
    const current = this.notifications.value;
    const updated = current.map(n => ({ ...n, read: true }));
    this.notifications.next(updated);
  }

  // Supprimer une notification
  removeNotification(id: string): void {
    const current = this.notifications.value;
    this.notifications.next(current.filter(n => n.id !== id));
  }

  // Vider toutes les notifications
  clearAll(): void {
    this.notifications.next([]);
  }

  // Obtenir le nombre de notifications non lues
  getUnreadCount(): number {
    return this.notifications.value.filter(n => !n.read).length;
  }

  // Durées par défaut selon le type
  private getDefaultDuration(type: string): number {
    switch (type) {
      case 'success': return 3000;
      case 'info': return 4000;
      case 'warning': return 5000;
      case 'error': return 6000;
      default: return 4000;
    }
  }

  // Méthodes de convenance
  success(title: string, message: string, autoClose = true): void {
    this.addNotification({ title, message, type: 'success', autoClose });
  }

  error(title: string, message: string, autoClose = false): void {
    this.addNotification({ title, message, type: 'error', autoClose });
  }

  warning(title: string, message: string, autoClose = true): void {
    this.addNotification({ title, message, type: 'warning', autoClose });
  }

  info(title: string, message: string, autoClose = true): void {
    this.addNotification({ title, message, type: 'info', autoClose });
  }
}