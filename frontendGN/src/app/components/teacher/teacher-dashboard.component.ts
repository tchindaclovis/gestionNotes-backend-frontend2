import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GradeService } from '../../services/grade.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Grade, Subject } from '../../models/grade.model';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">✏️ Gestion des Notes</h1>
            <p class="text-gray-600 mt-2">Saisissez et gérez les notes de vos étudiants</p>
          </div>
          <button (click)="openGradeModal()" class="btn-primary">
            ➕ Nouvelle Note
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="stat-card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <span class="text-xl">📝</span>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Notes Saisies</p>
                <p class="text-2xl font-semibold text-gray-900">{{ grades.length }}</p>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600">
                <span class="text-xl">📚</span>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Matières</p>
                <p class="text-2xl font-semibold text-gray-900">{{ subjects.length }}</p>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <span class="text-xl">👥</span>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Classes</p>
                <p class="text-2xl font-semibold text-gray-900">{{ assignedClasses.length }}</p>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                <span class="text-xl">⚖️</span>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Moyenne Classe</p>
                <p class="text-2xl font-semibold text-gray-900">{{ getClassAverage() }}/20</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtres -->
        <div class="mb-6">
          <div class="flex space-x-4">
            <select class="input-field w-48" [(ngModel)]="selectedClass">
              <option value="">Toutes les classes</option>
              <option *ngFor="let cls of assignedClasses" [value]="cls">{{ cls }}</option>
            </select>
            <select class="input-field w-48" [(ngModel)]="selectedSubject">
              <option value="">Toutes les matières</option>
              <option *ngFor="let subject of subjects" [value]="subject.id">{{ subject.name }}</option>
            </select>
          </div>
        </div>

        <!-- Tableau des notes -->
        <div class="card">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold">Notes Récentes</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matière</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coefficient</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commentaire</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let grade of filteredGrades">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ grade.studentName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ getSubjectName(grade.subjectId) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold" [class]="getGradeColor(grade.value)">
                    {{ grade.value }}/20
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ grade.coefficient }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ grade.comment || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button (click)="openGradeModal(grade)" class="text-blue-600 hover:text-blue-900 mr-3">
                      ✏️ Modifier
                    </button>
                    <button (click)="deleteGrade(grade)" class="text-red-600 hover:text-red-900">
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de saisie -->
    <div *ngIf="showGradeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingGrade ? '✏️ Modifier la Note' : '➕ Nouvelle Note' }}
          </h3>
          
          <form [formGroup]="gradeForm" (ngSubmit)="onSubmitGrade()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Étudiant</label>
                <select formControlName="studentId" class="input-field">
                  <option value="">Sélectionner un étudiant</option>
                  <option *ngFor="let student of students" [value]="student.id">
                    {{ student.firstname }} {{ student.lastname }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                <select formControlName="subjectId" class="input-field">
                  <option value="">Sélectionner une matière</option>
                  <option *ngFor="let subject of subjects" [value]="subject.id">
                    {{ subject.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Note (/20)</label>
                <input type="number" formControlName="value" class="input-field" min="0" max="20" step="0.5">
                <div *ngIf="gradeForm.get('value')?.invalid && gradeForm.get('value')?.touched" class="text-red-500 text-sm mt-1">
                  Note requise entre 0 et 20
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Coefficient</label>
                <input type="number" formControlName="coefficient" class="input-field" min="0.5" max="5" step="0.5">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                <textarea formControlName="comment" class="input-field" rows="3" placeholder="Commentaire sur la copie..."></textarea>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" (click)="closeGradeModal()" class="btn-secondary">
                Annuler
              </button>
              <button type="submit" [disabled]="gradeForm.invalid" class="btn-primary disabled:opacity-50">
                {{ editingGrade ? 'Modifier' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class TeacherDashboardComponent implements OnInit {
  gradeForm: FormGroup;
  grades: Grade[] = [];
  filteredGrades: Grade[] = [];
  subjects: Subject[] = [];
  students: any[] = [];
  assignedClasses: string[] = [];
  selectedClass = '';
  selectedSubject = '';
  showGradeModal = false;
  editingGrade: Grade | null = null;

  constructor(
    private fb: FormBuilder,
    private gradeService: GradeService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.gradeForm = this.fb.group({
      studentId: ['', Validators.required],
      subjectId: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      coefficient: ['', [Validators.required, Validators.min(0.5), Validators.max(5)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    console.log('Initialisation TeacherDashboard');
    this.loadTeacherData();
  }

  loadTeacherData(): void {
    // Charger les matières depuis l'API
    this.loadSubjects();
    
    // Charger les étudiants
    this.loadStudents();

    // Classes assignées - à remplacer par un appel API
    this.assignedClasses = ['3A', '3B', '4A'];
    
    // Charger les notes existantes
    this.loadGrades();
  }
  
  private loadSubjects(): void {
    // Utiliser l'API des matières
    fetch('http://localhost:8083/api/subjects', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(subjects => {
      this.subjects = subjects;
    })
    .catch(error => {
      console.error('Erreur lors du chargement des matières:', error);
      // Fallback avec des matières par défaut
      this.subjects = [
        { id: 1, name: 'Mathématiques', subjectCode: 'MATH', coefficient: 3 },
        { id: 2, name: 'Physique', subjectCode: 'PHYS', coefficient: 2.5 },
        { id: 3, name: 'Informatique', subjectCode: 'INFO', coefficient: 3 }
      ];
    });
  }
  
  private loadStudents(): void {
    console.log('Chargement des étudiants...');
    // Utiliser l'API spécifique pour les enseignants
    fetch('http://localhost:8083/api/admin/users/students-list', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Statut réponse:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(users => {
      console.log('Réponse API users:', users);
      // Vérifier si users est un tableau
      const userArray = Array.isArray(users) ? users : [];
      this.students = userArray.map((u: any) => ({ id: u.id, firstname: u.firstname, lastname: u.lastname }));
      console.log('Étudiants chargés:', this.students);
      
      // Si aucun étudiant trouvé, utiliser fallback
      if (this.students.length === 0) {
        console.warn('Aucun étudiant trouvé, utilisation du fallback');
        this.students = [
          { id: 1, firstname: 'Alice', lastname: 'Durand' },
          { id: 2, firstname: 'Bob', lastname: 'Martin' },
          { id: 3, firstname: 'Claire', lastname: 'Bernard' }
        ];
      }
    })
    .catch(error => {
      console.error('Erreur lors du chargement des étudiants:', error);
      // Fallback avec des étudiants par défaut
      this.students = [
        { id: 1, firstname: 'Alice', lastname: 'Durand' },
        { id: 2, firstname: 'Bob', lastname: 'Martin' },
        { id: 3, firstname: 'Claire', lastname: 'Bernard' }
      ];
      console.log('Utilisation des étudiants par défaut:', this.students);
    });
  }
  
  private loadGrades(): void {
    // TODO: Implémenter l'API des notes
    this.grades = [];
    this.filteredGrades = [];
  }
  
  private async saveGradeToAPI(grade: Grade): Promise<void> {
    const gradeRequest = {
      value: grade.value,
      date: grade.date,
      comment: grade.comment,
      studentId: grade.studentId,
      subjectId: grade.subjectId,
      coefficient: grade.coefficient
    };
    
    const response = await fetch('http://localhost:8083/api/new-grades', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gradeRequest)
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return response.json();
  }

  openGradeModal(grade?: Grade): void {
    this.editingGrade = grade || null;
    if (grade) {
      this.gradeForm.patchValue(grade);
    } else {
      this.gradeForm.reset();
    }
    this.showGradeModal = true;
  }

  closeGradeModal(): void {
    this.showGradeModal = false;
    this.editingGrade = null;
    this.gradeForm.reset();
  }

  onSubmitGrade(): void {
    if (this.gradeForm.valid) {
      const gradeData = this.gradeForm.value;
      
      // Trouver les noms pour l'affichage
      const student = this.students.find(s => s.id == gradeData.studentId);
      const subject = this.subjects.find(s => s.id == gradeData.subjectId);
      
      if (this.editingGrade) {
        // Modification d'une note existante
        const index = this.grades.findIndex(g => g.id === this.editingGrade!.id);
        if (index !== -1) {
          this.grades[index] = {
            ...this.editingGrade,
            ...gradeData,
            studentName: `${student?.firstname} ${student?.lastname}`,
            subjectName: subject?.name
          };
        }
      } else {
        // Création d'une nouvelle note
        const newGrade: Grade = {
          id: Date.now(), // ID temporaire
          value: gradeData.value,
          coefficient: gradeData.coefficient,
          comment: gradeData.comment,
          date: new Date().toISOString(),
          studentId: gradeData.studentId,
          subjectId: gradeData.subjectId,
          teacherId: 1, // TODO: Récupérer l'ID du professeur connecté
          studentName: `${student?.firstname} ${student?.lastname}`,
          subjectName: subject?.name
        };
        
        // Pour l'instant, sauvegarde locale seulement
        this.grades.push(newGrade);
        
        // TODO: Activer quand l'API sera prête
        // this.saveGradeToAPI(newGrade);
      }
      
      this.filteredGrades = [...this.grades];
      this.closeGradeModal();
      
      // Notification de succès
      alert(this.editingGrade ? 'Note modifiée avec succès !' : 'Note créée avec succès !');
    }
  }

  deleteGrade(grade: Grade): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      this.grades = this.grades.filter(g => g.id !== grade.id);
      this.filteredGrades = [...this.grades];
    }
  }

  getSubjectName(subjectId: number): string {
    const subject = this.subjects.find(s => s.id === subjectId);
    return subject?.name || 'Matière inconnue';
  }

  getGradeColor(value: number): string {
    if (value >= 16) return 'text-green-600';
    if (value >= 14) return 'text-blue-600';
    if (value >= 10) return 'text-yellow-600';
    return 'text-red-600';
  }

  getClassAverage(): number {
    if (this.grades.length === 0) return 0;
    const total = this.grades.reduce((sum, grade) => sum + grade.value, 0);
    return Math.round((total / this.grades.length) * 100) / 100;
  }
}