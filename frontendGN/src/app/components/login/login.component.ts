import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    console.log('onSubmit called');
    console.log('Form valid:', this.loginForm.valid);
    console.log('Form value:', this.loginForm.value);
    
    if (this.loginForm.valid) {
      console.log('Starting login process...');
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login success:', response);
          this.isLoading = false;
          if (response.token) {
            console.log('Token received, waiting for user to be loaded...');
            // Attendre que l'utilisateur soit chargé avant de naviguer
            setTimeout(() => {
              console.log('Is authenticated:', this.authService.isAuthenticated());
              console.log('Current user:', this.authService.getCurrentUser());
              console.log('Navigating to dashboard...');
              this.router.navigate(['/dashboard']).then(success => {
                console.log('Navigation result:', success);
              });
            }, 100);
          }
        },
        error: (error) => {
          console.log('Login error:', error);
          this.isLoading = false;
          if (error.status === 401) {
            this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
          } else if (error.status === 0) {
            this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend Spring Boot est démarré sur le port 8083.';
          } else {
            this.errorMessage = error.message || 'Erreur de connexion';
          }
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  fillDemo(username: string, password: string): void {
    this.loginForm.patchValue({ username, password });
  }
}