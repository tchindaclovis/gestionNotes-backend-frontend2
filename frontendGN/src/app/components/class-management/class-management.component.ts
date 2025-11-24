import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassService, ClassModel } from '../../services/class.service';

@Component({
  selector: 'app-class-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- === CONTENEUR PRINCIPAL === -->
    <div class="p-6">
      
      <!-- === EN-TÊTE AVEC TITRE ET BOUTON D'ACTION === -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">📚 Gestion des Classes</h2>
          <p class="text-gray-600 mt-1">Gérez les classes et années académiques</p>
        </div>
        <button (click)="openModal()" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">➕ Nouvelle Classe</button>
      </div>

      <!-- === GRILLE DES CLASSES (RESPONSIVE) === -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Carte pour chaque classe -->
        <div *ngFor="let class of classes" class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          
          <!-- Informations de la classe -->
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ class.name }}</h3>
            <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{{ class.academicYear }}</span>
          </div>
          
          <!-- Actions disponibles -->
          <div class="flex space-x-2">
            <button (click)="editClass(class)" class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50">✏️ Modifier</button>
            <button *ngIf="class.id" (click)="deleteClass(class.id)" class="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50">🗑️ Supprimer</button>
          </div>
        </div>
      </div>

      <!-- === MODALE DE CRÉATION/MODIFICATION === -->
      <div *ngIf="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          
          <!-- En-tête dynamique selon le mode -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ editingClass ? '✏️ Modifier la Classe' : '➕ Nouvelle Classe' }}</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>
          
          <!-- Formulaire de classe -->
          <form [formGroup]="classForm" (ngSubmit)="onSubmit()">
            
            <!-- Champ : Nom de la classe -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom de la classe</label>
              <input formControlName="name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: 3ème A">
            </div>
            
            <!-- Champ : Année académique -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Année académique</label>
              <input formControlName="academicYear" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: 2024-2025">
            </div>
            
            <!-- Actions du formulaire -->
            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" (click)="closeModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Annuler</button>
              <button type="submit" [disabled]="classForm.invalid" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">{{ editingClass ? 'Modifier' : 'Créer' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [] // Styles convertis en classes Tailwind
})
export class ClassManagementComponent implements OnInit {
  classes: ClassModel[] = [];
  showModal = false;
  editingClass: ClassModel | null = null;
  classForm: FormGroup;

  constructor(private classService: ClassService, private fb: FormBuilder) {
    this.classForm = this.fb.group({
      name: ['', [Validators.required]],
      academicYear: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classService.getAllClasses().subscribe({
      next: (classes) => this.classes = classes,
      error: (error) => {
        console.error('Erreur lors du chargement des classes:', error);
        alert('Erreur lors du chargement des classes. Veuillez réessayer.');
      }
    });
  }

  openModal(): void {
    this.showModal = true;
    this.editingClass = null;
    this.classForm.reset();
  }

  editClass(classItem: ClassModel): void {
    this.showModal = true;
    this.editingClass = classItem;
    this.classForm.patchValue({ name: classItem.name, academicYear: classItem.academicYear });
  }

  closeModal(): void {
    this.showModal = false;
    this.editingClass = null;
    this.classForm.reset();
  }

  onSubmit(): void {
    if (this.classForm.valid) {
      const classData: ClassModel = this.classForm.value;
      if (this.editingClass) {
        this.classService.updateClass(this.editingClass.id!, classData).subscribe({
          next: () => { this.loadClasses(); this.closeModal(); },
          error: (error) => {
            console.error('Erreur lors de la modification:', error);
            alert('Erreur lors de la modification de la classe.');
          }
        });
      } else {
        this.classService.createClass(classData).subscribe({
          next: () => { this.loadClasses(); this.closeModal(); },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            alert('Erreur lors de la création de la classe.');
          }
        });
      }
    }
  }

  deleteClass(id: number): void {
    if (confirm('Supprimer cette classe ?')) {
      this.classService.deleteClass(id).subscribe({
        next: () => this.loadClasses(),
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de la classe.');
        }
      });
    }
  }
}