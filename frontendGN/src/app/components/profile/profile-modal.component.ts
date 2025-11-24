import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { AvatarService } from '../../services/avatar.service';
import { ProfilePhotoService } from '../../services/profile-photo.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="isOpen" class="modal-overlay" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ currentStep === 1 ? 'Photo de Profil' : 'Informations Personnelles' }}</h2>
          <button class="close-btn" (click)="closeModal()">✕</button>
        </div>

        <div class="modal-body">
          <!-- Étape 1: Photo de profil -->
          <div *ngIf="currentStep === 1" class="profile-photo-section">
            <div class="current-photo">
              <img [src]="getCurrentPhoto()" [alt]="user?.firstname + ' ' + user?.lastname" class="profile-image">
            </div>
            
            <div class="photo-actions">
              <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none;">
              <button class="btn-upload" (click)="fileInput.click()">
                📷 Changer la photo
              </button>
              <button *ngIf="hasCustomPhoto()" class="btn-remove" (click)="removePhoto()">
                🗑️ Supprimer
              </button>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn-secondary" (click)="closeModal()">
                Annuler
              </button>
              <button type="button" class="btn-primary" (click)="nextStep()">
                Suivant
              </button>
            </div>
          </div>

          <!-- Étape 2: Informations utilisateur -->
          <div *ngIf="currentStep === 2">
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <div class="form-section">
                <div class="form-row">
                  <div class="form-group">
                    <label>Prénom</label>
                    <input type="text" formControlName="firstname" class="form-input">
                  </div>
                  
                  <div class="form-group">
                    <label>Nom</label>
                    <input type="text" formControlName="lastname" class="form-input">
                  </div>
                </div>

                <div class="form-group">
                  <label>Email</label>
                  <input type="email" formControlName="email" class="form-input">
                </div>

                <div class="form-group">
                  <label>Nom d'utilisateur</label>
                  <input type="text" formControlName="username" class="form-input" readonly>
                </div>

                <div class="form-group">
                  <label>Rôle</label>
                  <input type="text" [value]="getRoleLabel()" class="form-input" readonly>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn-secondary" (click)="previousStep()">
                  Précédent
                </button>
                <button type="submit" class="btn-primary" [disabled]="profileForm.invalid">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 500px;
      height: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e0e7ff;
    }

    .modal-header h2 {
      margin: 0;
      color: #1e40af;
      font-size: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #64748b;
      padding: 4px;
      border-radius: 4px;
    }

    .close-btn:hover {
      background: #f1f5f9;
    }

    .modal-body {
      padding: 24px;
    }

    .profile-photo-section {
      text-align: center;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #f1f5f9;
    }

    .current-photo {
      margin-bottom: 16px;
    }

    .profile-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #e0e7ff;
    }

    .photo-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .btn-upload, .btn-remove {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .btn-upload {
      background: #3b82f6;
      color: white;
    }

    .btn-upload:hover {
      background: #2563eb;
    }

    .btn-remove {
      background: #ef4444;
      color: white;
    }

    .btn-remove:hover {
      background: #dc2626;
    }

    .form-section h3 {
      color: #1e40af;
      margin-bottom: 16px;
      font-size: 1.1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 4px;
      color: #374151;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .form-input {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #e0e7ff;
      border-radius: 8px;
      font-size: 0.9rem;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .form-input[readonly] {
      background: #f8fafc;
      color: #64748b;
    }

    .modal-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 24px;
      border-top: 1px solid #f1f5f9;
    }

    .btn-primary, .btn-secondary {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f1f5f9;
      color: #64748b;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
    }
  `]
})
export class ProfileModalComponent {
  @Input() isOpen = false;
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();

  profileForm: FormGroup;
  currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private avatarService: AvatarService,
    private profilePhotoService: ProfilePhotoService
  ) {
    this.profileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['']
    });
  }

  ngOnChanges(): void {
    if (this.user) {
      this.profileForm.patchValue({
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.user.email,
        username: this.user.username
      });
    }
  }

  getCurrentPhoto(): string {
    // Vérifier s'il y a une photo uploadée
    if (this.user) {
      const savedPhoto = this.profilePhotoService.getPhoto(this.user.id);
      if (savedPhoto) {
        return savedPhoto;
      }
    }
    
    // Sinon, utiliser l'avatar généré avec des valeurs uniques
    const firstname = this.user?.firstname || `User${this.user?.id || Math.random()}`;
    const lastname = this.user?.lastname || `Default${this.user?.id || Math.random()}`;
    return this.avatarService.generateAvatar(firstname, lastname);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file || !this.user) return;

    // Validation du type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Type de fichier non autorisé. Utilisez JPG, PNG ou GIF.');
      return;
    }

    // Validation de la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Fichier trop volumineux. Taille maximale: 5MB.');
      return;
    }

    // Upload vers le serveur
    this.uploadPhoto(file);
  }
  
  private uploadPhoto(file: File): void {
    if (!this.user) return;
    
    const formData = new FormData();
    formData.append('photo', file);
    
    // TODO: Remplacer par l'appel API réel
    // this.userService.uploadProfilePhoto(this.user.id, formData).subscribe({
    //   next: () => {
    //     console.log('Photo uploadée avec succès');
    //     // Recharger l'image
    //   },
    //   error: (error) => {
    //     console.error('Erreur upload:', error);
    //   }
    // });
    
    // Simulation locale pour l'instant
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Utiliser le service pour sauvegarder et notifier
      this.profilePhotoService.updatePhoto(this.user!.id, e.target?.result);
      console.log('Photo sauvegardée localement');
    };
    reader.readAsDataURL(file);
  }

  hasCustomPhoto(): boolean {
    return this.user ? !!this.profilePhotoService.getPhoto(this.user.id) : false;
  }

  removePhoto(): void {
    if (this.user && confirm('Voulez-vous vraiment supprimer votre photo de profil ?')) {
      this.profilePhotoService.removePhoto(this.user.id);
      console.log('Photo supprimée');
    }
  }

  getRoleLabel(): string {
    if (!this.user) return '';
    switch (this.user.role) {
      case 'ADMIN': return 'Administrateur';
      case 'TEACHER': return 'Enseignant';
      case 'STUDENT': return 'Étudiant';
      default: return this.user.role;
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.user) {
      const updatedUser = {
        ...this.user,
        ...this.profileForm.value
      };
      this.save.emit(updatedUser);
    }
  }

  nextStep(): void {
    this.currentStep = 2;
  }

  previousStep(): void {
    this.currentStep = 1;
  }

  closeModal(): void {
    this.currentStep = 1;
    this.close.emit();
  }
}