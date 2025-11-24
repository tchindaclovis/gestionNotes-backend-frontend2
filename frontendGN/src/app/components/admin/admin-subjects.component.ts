import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from '../../services/subject.service';
import { AuthService } from '../../services/auth.service';
import { Subject } from '../../models/grade.model';

@Component({
  selector: 'app-admin-subjects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold">📚 Catalogue des Matières</h3>
        <button (click)="openSubjectModal()" class="btn-primary">
          ➕ Nouvelle Matière
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let subject of subjects" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-2">
            <h4 class="font-semibold text-gray-900">{{ subject.name }}</h4>
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{{ subject.subjectCode }}</span>
          </div>
          <p class="text-sm text-gray-600 mb-2">{{ subject.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">Coeff: {{ subject.coefficient }}</span>
            <div class="flex space-x-2">
              <button (click)="openSubjectModal(subject)" class="text-blue-600 hover:text-blue-900 text-sm">
                ✏️ Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Matière -->
    <div *ngIf="showSubjectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingSubject ? 'Modifier Matière' : 'Nouvelle Matière' }}
        </h3>
        
        <form [formGroup]="subjectForm" (ngSubmit)="onSubmitSubject()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom de la matière</label>
              <input formControlName="name" class="input-field" placeholder="Ex: Mathématiques">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Code matière</label>
              <input formControlName="subjectCode" class="input-field" placeholder="Ex: MATH101">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Coefficient</label>
              <input type="number" formControlName="coefficient" class="input-field" min="0.5" max="5" step="0.5">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea formControlName="description" class="input-field" rows="3" placeholder="Description de la matière..."></textarea>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" (click)="closeSubjectModal()" class="btn-secondary">Annuler</button>
            <button type="submit" [disabled]="subjectForm.invalid" class="btn-primary">
              {{ editingSubject ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminSubjectsComponent implements OnInit {
  subjects: Subject[] = [];
  showSubjectModal = false;
  editingSubject: Subject | null = null;
  subjectForm: FormGroup;
  
  constructor(
    private subjectService: SubjectService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      subjectCode: ['', Validators.required],
      coefficient: [1, [Validators.required, Validators.min(0.5), Validators.max(5)]],
      description: ['']
    });
  }
  
  ngOnInit(): void {
    console.log('Current user:', this.authService.getCurrentUser());
    console.log('Is authenticated:', this.authService.isAuthenticated());
    this.loadSubjects();
  }
  
  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => this.subjects = subjects,
      error: (error) => console.error('Erreur:', error)
    });
  }

  openSubjectModal(subject?: Subject): void {
    this.editingSubject = subject || null;
    if (subject) {
      this.subjectForm.patchValue(subject);
    } else {
      this.subjectForm.reset({ coefficient: 1 });
    }
    this.showSubjectModal = true;
  }

  closeSubjectModal(): void {
    this.showSubjectModal = false;
    this.editingSubject = null;
    this.subjectForm.reset();
  }

  onSubmitSubject(): void {
    if (this.subjectForm.valid) {
      const subjectData = this.subjectForm.value;
      
      if (this.editingSubject) {
        this.subjectService.updateSubject(this.editingSubject.subjectCode, subjectData).subscribe({
          next: () => {
            this.loadSubjects();
            this.closeSubjectModal();
          },
          error: (error) => console.error('Erreur modification:', error)
        });
      } else {
        console.log('Attempting to create subject. Form data:', subjectData);
        this.subjectService.createSubject(subjectData).subscribe({
          next: () => {
            console.log('Subject created successfully');
            this.loadSubjects();
            this.closeSubjectModal();
          },
          error: (error) => {
            console.error('Erreur création:', error);
            if (error.status === 401) {
              console.error('Authentication failed. User might not have ADMIN role or token is invalid.');
            }
          }
        });
      }
    }
  }
}