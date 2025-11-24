import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BackendStatusService } from '../../services/backend-status.service';

@Component({
  selector: 'app-backend-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="status-indicator" [class]="getStatusClass()">
      <div class="status-dot"></div>
      <span class="status-text">{{ getStatusText() }}</span>
      <button *ngIf="!isOnline" (click)="retry()" class="retry-btn">🔄</button>
    </div>
  `,
  styles: [`
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status-online {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
    }

    .status-offline {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .status-online .status-dot {
      background: #10b981;
    }

    .status-offline .status-dot {
      background: #ef4444;
    }

    .retry-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class BackendStatusComponent implements OnInit, OnDestroy {
  isOnline = false;
  private subscription: Subscription = new Subscription();

  constructor(private backendStatusService: BackendStatusService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.backendStatusService.backendStatus$.subscribe(status => {
        this.isOnline = status;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getStatusClass(): string {
    return this.isOnline ? 'status-online' : 'status-offline';
  }

  getStatusText(): string {
    return this.isOnline ? 'Backend connecté' : 'Mode hors ligne';
  }

  retry(): void {
    this.backendStatusService.checkBackendStatus();
  }
}