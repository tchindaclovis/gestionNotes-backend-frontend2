import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradeService } from '../../services/grade.service';
import { AuthService } from '../../services/auth.service';
import { TranscriptService } from '../../services/transcript.service';
import { Grade, GradeStats } from '../../models/grade.model';
import { SimpleChartComponent, ChartData } from '../charts/simple-chart.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, SimpleChartComponent],
  template: `
    <!-- === CONTENEUR PRINCIPAL === -->
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        
        <!-- === EN-TÊTE DU DASHBOARD === -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">📊 Mon Tableau de Bord</h1>
          <p class="text-gray-600 mt-2">Consultez vos résultats et performances</p>
        </div>

        <!-- === CARTES DE STATISTIQUES PRINCIPALES === -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="stat-card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Moyenne Générale</p>
                <p class="text-2xl font-semibold text-gray-900">{{ getOverallAverage() }}/20</p>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Matières</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.length }}</p>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Notes Totales</p>
                <p class="text-2xl font-semibold text-gray-900">{{ grades.length }}</p>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <button (click)="downloadTranscript()" class="w-full btn-primary">
              📥 Télécharger Relevé
            </button>
          </div>
        </div>

        <!-- === FILTRES PAR SEMESTRE === -->
        <div class="mb-6">
          <div class="flex space-x-4">
            <button 
              *ngFor="let semester of semesters"
              (click)="filterBySemester(semester)"
              [class]="selectedSemester === semester ? 'btn-primary' : 'btn-secondary'"
            >
              🔍 {{ semester }}
            </button>
          </div>
        </div>

        <!-- === SECTION PRINCIPALE : GRAPHIQUES ET TABLEAUX === -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Graphique des moyennes par matière -->
          <app-simple-chart 
            [data]="getChartData()" 
            [title]="'📈 Moyennes par Matière'"
            type="bar">
          </app-simple-chart>

          <!-- Tableau des dernières notes -->
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">Dernières Notes</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matière</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coeff</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let grade of filteredGrades.slice(0, 5)">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ grade.subjectName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <span [class]="grade.value >= 10 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                        {{ grade.value }}/20
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ grade.coefficient }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ grade.date | date:'dd/MM/yyyy' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- === SECTION DÉTAIL PAR MATIÈRE === -->
        <div class="mt-8">
          <h3 class="text-lg font-semibold mb-4">Détail par Matière</h3>
          <!-- Grille des statistiques par matière -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let stat of stats" class="card">
              <h4 class="font-semibold text-gray-900 mb-2">{{ stat.subjectName }}</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Moyenne:</span>
                  <span [class]="stat.average >= 10 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                    {{ stat.average }}/20
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Min:</span>
                  <span class="text-gray-900">{{ stat.min }}/20</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Max:</span>
                  <span class="text-gray-900">{{ stat.max }}/20</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Notes:</span>
                  <span class="text-gray-900">{{ stat.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  grades: Grade[] = [];
  filteredGrades: Grade[] = [];
  stats: GradeStats[] = [];
  selectedSemester = 'Tous les semestres';
  semesters = ['Tous les semestres', 'Semestre 1', 'Semestre 2'];

  constructor(
    private gradeService: GradeService,
    private authService: AuthService,
    private transcriptService: TranscriptService
  ) {}

  ngOnInit(): void {
    this.loadStudentData();
  }

  loadStudentData(): void {
    const currentUser = this.authService.getCurrentUser();
    // Utiliser username comme studentIdNum pour le moment
    const studentIdNum = currentUser?.user?.username || 'STU001';



    // Charger les notes depuis l'API
    this.gradeService.getStudentGrades(studentIdNum).subscribe({
      next: (grades) => {

        this.grades = grades;
        this.filteredGrades = [...this.grades];
      },
      error: (error) => {

      }
    });

    // Charger les statistiques depuis l'API
    this.gradeService.getStudentStats(studentIdNum).subscribe({
      next: (stats) => {

        this.stats = stats;
      },
      error: (error) => {

      }
    });
  }

  filterBySemester(semester: string): void {
    this.selectedSemester = semester;
    if (semester === 'Tous les semestres') {
      this.filteredGrades = [...this.grades];
    } else {
      const date = new Date();
      const month = date.getMonth() + 1;
      this.filteredGrades = this.grades.filter(grade => {
        const gradeDate = new Date(grade.date);
        const gradeMonth = gradeDate.getMonth() + 1;
        return semester === 'Semestre 1' ? gradeMonth <= 6 : gradeMonth > 6;
      });
    }
  }

  downloadTranscript(): void {
    const currentUser = this.authService.getCurrentUser();
    const studentIdNum = currentUser?.user?.username || 'student1';
    
    this.transcriptService.generateStudentTranscript(studentIdNum).subscribe({
      next: (blob) => {
        this.transcriptService.downloadTranscript(blob, studentIdNum);
        alert('✅ Relevé de notes téléchargé avec succès');
      },
      error: (error) => {

        // Fallback vers simulation
        const content = `RELEVÉ DE NOTES\n\nMoyenne générale: ${this.getOverallAverage()}/20\n\nDétail par matière:\n${this.stats.map(s => `${s.subjectName}: ${s.average}/20`).join('\n')}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'releve-notes.txt';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  getOverallAverage(): number {
    if (this.stats.length === 0) return 0;
    const total = this.stats.reduce((sum, stat) => sum + stat.average, 0);
    return Math.round((total / this.stats.length) * 100) / 100;
  }

  getChartData(): ChartData[] {
    return this.stats.map(stat => ({
      label: stat.subjectName,
      value: stat.average,
      color: stat.average >= 16 ? '#10b981' : 
             stat.average >= 14 ? '#3b82f6' : 
             stat.average >= 10 ? '#f59e0b' : '#ef4444'
    }));
  }
}