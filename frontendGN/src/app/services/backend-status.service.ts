import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendStatusService implements OnDestroy {
  private readonly API_URL = 'http://localhost:8083/api';
  private backendStatusSubject = new BehaviorSubject<boolean>(false);
  public backendStatus$ = this.backendStatusSubject.asObservable();
  private intervalId: any;

  constructor(private http: HttpClient) {
    this.checkBackendStatus();
    // Vérifier le statut toutes les 30 secondes
    this.intervalId = setInterval(() => this.checkBackendStatus(), 30000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  checkBackendStatus(): void {
    this.http.get(`${this.API_URL}/health`, { observe: 'response' })
      .pipe(
        map(response => response.status === 200),
        catchError(() => {
          // Essayer avec un endpoint alternatif
          return this.http.get(`${this.API_URL}/auth/test`)
            .pipe(
              map(() => true),
              catchError(() => of(false))
            );
        })
      )
      .subscribe(isOnline => {
        this.backendStatusSubject.next(isOnline);
        console.log(`Backend status: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
      });
  }

  isBackendOnline(): boolean {
    return this.backendStatusSubject.value;
  }

  testConnection(): Observable<boolean> {
    return this.http.get(`${this.API_URL}/health`, { observe: 'response' })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }
}