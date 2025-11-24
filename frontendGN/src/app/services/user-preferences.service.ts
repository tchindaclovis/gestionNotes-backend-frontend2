import { Injectable } from '@angular/core';

export interface UserPreferences {
  activeSection: string;
  notifications: Notification[];
  lastLogin: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private readonly STORAGE_KEY = 'user_preferences';

  savePreferences(userId: number, preferences: UserPreferences): void {
    const key = `${this.STORAGE_KEY}_${userId}`;
    localStorage.setItem(key, JSON.stringify(preferences));
  }

  loadPreferences(userId: number): UserPreferences | null {
    const key = `${this.STORAGE_KEY}_${userId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }

  addNotification(userId: number, notification: Notification): void {
    const preferences = this.loadPreferences(userId) || {
      activeSection: 'dashboard',
      notifications: [],
      lastLogin: new Date().toISOString()
    };
    
    preferences.notifications.unshift(notification);
    preferences.notifications = preferences.notifications.slice(0, 50); // Garder 50 max
    
    this.savePreferences(userId, preferences);
  }
}