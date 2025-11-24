// Imports Angular essentiels
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Imports des services et modèles métier
import { EnrollmentService, Enrollment, EnrollmentRequest } from '../../services/enrollment.service';
import { ClassService, Class } from '../../services/class.service';
import { GradeService, Subject } from '../../services/grade.service';
import { UserService } from '../../services/user.service';

/**
 * Composant de gestion des inscriptions des étudiants
 * Permet aux administrateurs de :
 * - Visualiser toutes les inscriptions
 * - Créer de nouvelles inscriptions
 * - Supprimer des inscriptions existantes
 */
@Component({
  selector: 'app-enrollment-management',
  standalone: true, // Composant autonome (Angular 14+)
  imports: [CommonModule, ReactiveFormsModule], // Modules nécessaires
  template: `
    <!-- === CONTENEUR PRINCIPAL === -->
    <div class="p-6">
      
      <!-- === EN-TÊTE DE LA PAGE === -->
      <div class="flex justify-between items-center mb-6">
        <!-- Titre et description -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900">📝 Gestion des Inscriptions</h2>
          <p class="text-gray-600 mt-1">Gérez les inscriptions des étudiants aux classes et matières</p>
        </div>
        <!-- Bouton d'action principal -->
        <button (click)="openModal()" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">➕ Nouvelle Inscription</button>
      </div>

      <!-- === LISTE DES INSCRIPTIONS === -->
      <div class="grid grid-cols-1 gap-6">
        <!-- Carte pour chaque inscription -->
        <div *ngFor="let enrollment of enrollments" class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          
          <!-- En-tête de la carte : étudiant et semestre -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ enrollment.studentId }}</h3>
            <span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">{{ enrollment.semester }}</span>
          </div>
          
          <!-- Détails de l'inscription -->
          <div class="mb-4 space-y-1">
            <p class="text-sm text-gray-600"><strong>Classe:</strong> {{ getClassName(enrollment.classId) }}</p>
            <p class="text-sm text-gray-600"><strong>Matière:</strong> {{ getSubjectName(enrollment.subjectId) }}</p>
            <p class="text-sm text-gray-600"><strong>Année:</strong> {{ enrollment.academicYear }}</p>
            <p class="text-sm text-gray-600"><strong>Date:</strong> {{ enrollment.enrollmentDate | date:'dd/MM/yyyy' }}</p>
          </div>
          
          <!-- Actions disponibles -->
          <div class="flex justify-end">
            <button (click)="deleteEnrollment(enrollment.id)" class="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50">🗑️ Supprimer</button>
          </div>
        </div>
      </div>

      <!-- === MODALE DE CRÉATION D'INSCRIPTION === -->
      <div *ngIf="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          
          <!-- En-tête de la modale -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">➕ Nouvelle Inscription</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>
          
          <!-- Formulaire d'inscription -->
          <form [formGroup]="enrollmentForm" (ngSubmit)="onSubmit()">
            
            <!-- Champ : Numéro étudiant -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Numéro étudiant</label>
              <input formControlName="studentIdNum" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: STU001">
            </div>
            
            <!-- Sélecteur : Classe -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Classe</label>
              <select formControlName="classId" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sélectionner une classe</option>
                <option *ngFor="let class of classes" [value]="class.id">{{ class.name }}</option>
              </select>
            </div>
            
            <!-- Sélecteur : Matière -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Matière</label>
              <select formControlName="subjectId" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sélectionner une matière</option>
                <option *ngFor="let subject of subjects" [value]="subject.id">{{ subject.name }}</option>
              </select>
            </div>
            
            <!-- Champ : Année académique -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Année académique</label>
              <input formControlName="academicYear" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: 2024-2025">
            </div>
            
            <!-- Sélecteur : Semestre -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
              <select formControlName="semester" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sélectionner un semestre</option>
                <option value="Semestre 1">Semestre 1</option>
                <option value="Semestre 2">Semestre 2</option>
              </select>
            </div>
            
            <!-- Actions du formulaire -->
            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" (click)="closeModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Annuler</button>
              <button type="submit" [disabled]="enrollmentForm.invalid" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">Inscrire</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [] // Styles convertis en classes Tailwind dans le template
})
export class EnrollmentManagementComponent implements OnInit {
  // === PROPRIÉTÉS DE DONNÉES ===
  enrollments: Enrollment[] = []; // Liste de toutes les inscriptions
  classes: Class[] = [];          // Liste des classes disponibles
  subjects: Subject[] = [];       // Liste des matières disponibles
  
  // === PROPRIÉTÉS D'INTERFACE ===
  showModal = false;              // Contrôle l'affichage de la modale
  enrollmentForm: FormGroup;      // Formulaire réactif pour les inscriptions

  /**
   * Constructeur - Injection des dépendances et initialisation du formulaire
   */
  constructor(
    private enrollmentService: EnrollmentService, // Service pour gérer les inscriptions
    private classService: ClassService,           // Service pour gérer les classes
    private gradeService: GradeService,           // Service pour récupérer les matières
    private fb: FormBuilder                       // Builder pour créer des formulaires réactifs
  ) {
    // Initialisation du formulaire avec validation
    this.enrollmentForm = this.fb.group({
      studentIdNum: ['', [Validators.required]], // Numéro étudiant obligatoire
      classId: ['', [Validators.required]],      // Classe obligatoire
      subjectId: ['', [Validators.required]],    // Matière obligatoire
      academicYear: ['', [Validators.required]], // Année académique obligatoire
      semester: ['', [Validators.required]]      // Semestre obligatoire
    });
  }

  /**
   * Méthode du cycle de vie Angular - Appelée après l'initialisation du composant
   */
  ngOnInit(): void {
    this.loadData(); // Chargement initial des données
  }

  /**
   * Charge toutes les données nécessaires depuis les APIs
   * - Inscriptions existantes
   * - Classes disponibles
   * - Matières disponibles
   */
  loadData(): void {
    // Chargement des inscriptions existantes
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (enrollments) => this.enrollments = enrollments,
      error: (error) => console.error('Erreur chargement inscriptions:', error)
    });

    // Chargement des classes pour les sélecteurs
    this.classService.getAllClasses().subscribe({
      next: (classes) => this.classes = classes,
      error: (error) => console.error('Erreur chargement classes:', error)
    });

    // Chargement des matières pour les sélecteurs
    this.gradeService.getSubjects().subscribe({
      next: (subjects) => this.subjects = subjects,
      error: (error) => console.error('Erreur chargement matières:', error)
    });
  }

  /**
   * Ouvre la modale de création d'inscription
   * Remet à zéro le formulaire pour une nouvelle saisie
   */
  openModal(): void {
    this.showModal = true;           // Affiche la modale
    this.enrollmentForm.reset();     // Vide le formulaire
  }

  /**
   * Ferme la modale et nettoie le formulaire
   */
  closeModal(): void {
    this.showModal = false;          // Cache la modale
    this.enrollmentForm.reset();     // Vide le formulaire
  }

  /**
   * Traite la soumission du formulaire d'inscription
   * Valide les données et envoie la requête à l'API
   */
  onSubmit(): void {
    // Vérification de la validité du formulaire
    if (this.enrollmentForm.valid) {
      // Récupération des données du formulaire
      const enrollmentData: EnrollmentRequest = this.enrollmentForm.value;
      
      // Envoi de la requête de création à l'API
      this.enrollmentService.createEnrollment(enrollmentData).subscribe({
        next: () => {
          this.loadData();      // Recharge la liste des inscriptions
          this.closeModal();    // Ferme la modale
        },
        error: (error) => console.error('Erreur création inscription:', error)
      });
    }
  }

  /**
   * Supprime une inscription après confirmation de l'utilisateur
   * @param id - Identifiant unique de l'inscription à supprimer
   */
  deleteEnrollment(id: number): void {
    // Demande de confirmation avant suppression
    if (confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
      // Envoi de la requête de suppression à l'API
      this.enrollmentService.deleteEnrollment(id).subscribe({
        next: () => this.loadData(), // Recharge la liste après suppression
        error: (error) => console.error('Erreur suppression inscription:', error)
      });
    }
  }

  /**
   * Récupère le nom d'une classe à partir de son ID
   * @param classId - Identifiant de la classe
   * @returns Le nom de la classe ou un message par défaut
   */
  getClassName(classId: number): string {
    const classItem = this.classes.find(c => c.id === classId);
    return classItem ? classItem.name : 'Classe inconnue';
  }

  /**
   * Récupère le nom d'une matière à partir de son ID
   * @param subjectId - Identifiant de la matière
   * @returns Le nom de la matière ou un message par défaut
   */
  getSubjectName(subjectId: number): string {
    const subject = this.subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Matière inconnue';
  }
}