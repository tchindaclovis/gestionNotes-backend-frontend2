import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, throwError } from 'rxjs';
import { LoginRequest, LoginResponse, User, AuthUser, Role } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // === CONFIGURATION ===
  private readonly API_URL = environment.apiUrl;
  
  // === GESTION DE L'ÉTAT UTILISATEUR ===
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Chargement automatique de l'utilisateur depuis le stockage local
    this.loadUserFromStorage();
  }

  // === MÉTHODES D'AUTHENTIFICATION ===
  
  /**
   * Authentifie un utilisateur avec ses identifiants
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/signin`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            // Stockage du token et chargement des données utilisateur
            localStorage.setItem('token', response.token);
            this.loadUserFromToken(response.token);
          }
        })
      );
  }



  /**
   * Déconnecte l'utilisateur et nettoie les données
   */
  logout(): void {
    // Nettoyage du stockage local et de l'état
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
  
  updateCurrentUser(user: User): void {
    const currentAuth = this.currentUserSubject.value;
    if (currentAuth) {
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next({ user, token: currentAuth.token });
    }
  }

  // === MÉTHODES D'ACCÈS AUX DONNÉES ===
  
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload && payload.exp > now;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTokenExpirationTime(): Date | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }

  getTokenRemainingTime(): string {
    const expiration = this.getTokenExpirationTime();
    if (!expiration) return 'Token invalide';
    
    const now = new Date();
    const remaining = expiration.getTime() - now.getTime();
    
    if (remaining <= 0) return 'Token expiré';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}min restantes`;
  }

  // === MÉTHODES PRIVÉES DE GESTION ===
  
  /**
   * Charge l'utilisateur depuis le stockage local au démarrage
   */
  private loadUserFromStorage(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next({ user, token });
      } catch (error) {
        // En cas d'erreur, déconnexion automatique
        this.logout();
      }
    }
  }

  /**
   * Décode le token JWT et récupère les informations utilisateur depuis l'API
   */
  private loadUserFromToken(token: string): void {
    try {
      // Validation du format JWT
      if (!token || token.split('.').length !== 3) {
        throw new Error('Format de token invalide');
      }
      
      // Décodage du payload JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload || !payload.sub) {
        throw new Error('Payload de token invalide');
      }
      
      // Récupération des informations utilisateur depuis l'API
      this.http.get<any>(`${this.API_URL}/admin/users/username/${payload.sub}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).subscribe({
        next: (userResponse) => {
          const user: User = {
            id: userResponse.id,
            username: userResponse.username,
            firstname: userResponse.firstname,
            lastname: userResponse.lastname,
            email: userResponse.email,
            role: userResponse.role
          };
          
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next({ user, token });
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
          // Fallback avec les données du token
          const user: User = {
            id: payload.userId || 1,
            username: payload.sub,
            firstname: payload.firstname || (payload.sub === 'darwin' ? 'Super' : payload.sub),
            lastname: payload.lastname || (payload.sub === 'darwin' ? 'Admin' : 'User'),
            email: payload.email || `${payload.sub}@example.com`,
            role: this.mapRole(payload.roles || 'STUDENT')
          };
          
          console.log('Fallback user created:', user);
          console.log('Token payload:', payload);
          
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next({ user, token });
        }
      });
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      this.logout();
    }
  }

  /**
   * Convertit les autorités JWT en rôles applicatifs
   */
  private mapRole(authorities: any): Role {
    // Gestion des autorités sous forme de tableau
    if (Array.isArray(authorities)) {
      const authority = authorities[0]?.authority || authorities[0];
      return authority === 'ROLE_ADMIN' ? Role.ADMIN : 
             authority === 'ROLE_TEACHER' ? Role.TEACHER : 
             authority === 'ROLE_STUDENT' ? Role.STUDENT : Role.STUDENT;
    }
    // Gestion des autorités sous forme de chaîne
    const authStr = String(authorities).toUpperCase();
    if (authStr.includes('ROLE_ADMIN') || authStr.includes('ADMIN')) return Role.ADMIN;
    if (authStr.includes('ROLE_TEACHER') || authStr.includes('TEACHER')) return Role.TEACHER;
    if (authStr.includes('ROLE_STUDENT') || authStr.includes('STUDENT')) return Role.STUDENT;
    return Role.STUDENT;
  }
}