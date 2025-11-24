import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ErrorMessage {
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new BehaviorSubject<ErrorMessage | null>(null);
  public error$ = this.errorSubject.asObservable();

  showError(message: string): void {
    this.errorSubject.next({
      message,
      type: 'error',
      timestamp: new Date()
    });
    this.clearAfterDelay();
  }

  showSuccess(message: string): void {
    this.errorSubject.next({
      message,
      type: 'success',
      timestamp: new Date()
    });
    this.clearAfterDelay();
  }

  showWarning(message: string): void {
    this.errorSubject.next({
      message,
      type: 'warning',
      timestamp: new Date()
    });
    this.clearAfterDelay();
  }

  showInfo(message: string): void {
    this.errorSubject.next({
      message,
      type: 'info',
      timestamp: new Date()
    });
    this.clearAfterDelay();
  }

  clear(): void {
    this.errorSubject.next(null);
  }

  private clearAfterDelay(): void {
    setTimeout(() => {
      this.clear();
    }, 5000);
  }
}