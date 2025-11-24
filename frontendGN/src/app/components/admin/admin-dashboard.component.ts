import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { GradeService } from '../../services/grade.service';
import { SubjectService } from '../../services/subject.service';
import { ExportService } from '../../services/export.service';
import { TranscriptService } from '../../services/transcript.service';
import { NotificationApiService } from '../../services/notification-api.service';
import { MessageApiService } from '../../services/message-api.service';
import { StatisticsService } from '../../services/statistics.service';
import { User, Role, StudentRequest, TeacherRequest } from '../../models/user.model';
import { Subject, SubjectRequest } from '../../models/grade.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private readonly VALIDATION_RULES = {
    USERNAME_MIN_LENGTH: 3,
    NAME_MIN_LENGTH: 2,
    PASSWORD_MIN_LENGTH: 6,
    COEFFICIENT_MIN: 0.5
  };

  users: User[] = [];
  filteredUsers: User[] = [];
  subjects: Subject[] = [];
  selectedRole = '';
  stats = {
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
    successRate: 0
  };

  showUserModal = false;
  showSubjectModal = false;
  editingUser: User | null = null;
  editingSubject: Subject | null = null;

  userForm: FormGroup;
  subjectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private gradeService: GradeService,
    private subjectService: SubjectService,
    private exportService: ExportService,
    private transcriptService: TranscriptService,
    private notificationApiService: NotificationApiService,
    private messageApiService: MessageApiService,
    private statisticsService: StatisticsService
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(this.VALIDATION_RULES.USERNAME_MIN_LENGTH)]],
      firstname: ['', [Validators.required, Validators.minLength(this.VALIDATION_RULES.NAME_MIN_LENGTH)]],
      lastname: ['', [Validators.required, Validators.minLength(this.VALIDATION_RULES.NAME_MIN_LENGTH)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      classId: [''],
      password: ['', [Validators.required, Validators.minLength(this.VALIDATION_RULES.PASSWORD_MIN_LENGTH)]]
    });

    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      subjectCode: ['', Validators.required],
      coefficient: ['', [Validators.required, Validators.min(this.VALIDATION_RULES.COEFFICIENT_MIN)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filterUsers();
        this.updateStats();
      },
      error: (error) => console.error('Erreur:', error)
    });

    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.updateStats();
      },
      error: (error) => console.error('Erreur:', error)
    });
  }

  updateStats(): void {
    this.statisticsService.getDashboardStats().subscribe({
      next: (dashboardStats) => {
        this.stats.totalStudents = dashboardStats.totalStudents;
        this.stats.totalTeachers = dashboardStats.totalTeachers;
        this.stats.totalSubjects = dashboardStats.totalSubjects;
      },
      error: () => {
        // Fallback vers calcul local
        const userStats = this.users.reduce((acc, user) => {
          if (user.role === Role.STUDENT) acc.students++;
          else if (user.role === Role.TEACHER) acc.teachers++;
          return acc;
        }, { students: 0, teachers: 0 });
        
        this.stats.totalStudents = userStats.students;
        this.stats.totalTeachers = userStats.teachers;
        this.stats.totalSubjects = this.subjects.length;
      }
    });

    this.statisticsService.getPerformanceStats().subscribe({
      next: (perfStats) => {
        this.stats.successRate = perfStats.successRate;
      },
      error: () => {
        this.stats.successRate = this.calculateSuccessRate(this.stats.totalStudents);
      }
    });
  }

  private calculateSuccessRate(studentCount: number): number {
    if (studentCount === 0) return 0;
    return Math.round((studentCount / Math.max(this.users.length, 1)) * 100);
  }

  filterUsers(): void {
    if (this.selectedRole && this.selectedRole.trim() !== '') {
      this.filteredUsers = this.users.filter(u => u.role === this.selectedRole);
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  openUserModal(user?: User): void {
    console.log('openUserModal appelé avec:', user);
    this.editingUser = user || null;
    
    if (user) {
      this.userForm.patchValue(user);
      this.userForm.get('password')?.clearValidators();
    } else {
      this.userForm.reset();
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(this.VALIDATION_RULES.PASSWORD_MIN_LENGTH)]);
    }
    
    this.userForm.get('password')?.updateValueAndValidity();
    this.showUserModal = true;
    console.log('Modal ouverte, showUserModal:', this.showUserModal);
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.editingUser = null;
    this.userForm.reset();
  }

  onSubmitUser(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      
      if (this.editingUser) {
        this.userService.updateUser(this.editingUser.id, userData).subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex(u => u.id === this.editingUser!.id);
            if (index !== -1) {
              this.users[index] = { ...this.editingUser, ...userData };
            }
            this.updateStats();
            this.filterUsers();
            this.closeUserModal();
            this.showNotification('✅ Utilisateur modifié avec succès', 'success');
          },
          error: (error) => {
            this.showNotification('❌ Erreur lors de la modification', 'error');
          }
        });
      } else {
        if (userData.role === 'STUDENT') {
          const studentData: StudentRequest = {
            username: userData.username,
            password: userData.password,
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            studentIdNum: this.generateStudentId()
          };
          this.userService.createStudent(studentData).subscribe({
            next: (newUser) => {
              this.users.push(newUser);
              this.updateStats();
              this.filterUsers();
              this.closeUserModal();
              this.showNotification('✅ Étudiant créé avec succès', 'success');
            },
            error: (error) => {
              console.error('Erreur lors de la création de l\'utilisateur:', error);
              this.showNotification('❌ Erreur lors de la création', 'error');
            }
          });
        } else if (userData.role === 'TEACHER') {
          const teacherData: TeacherRequest = {
            username: userData.username,
            password: userData.password,
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            teacherIdNum: this.generateTeacherId()
          };
          this.userService.createTeacher(teacherData).subscribe({
            next: (newUser) => {
              this.users.push(newUser);
              this.updateStats();
              this.filterUsers();
              this.closeUserModal();
              this.showNotification('✅ Enseignant créé avec succès', 'success');
            },
            error: (error) => {
              console.error('Erreur lors de la création de l\'utilisateur:', error);
              this.showNotification('❌ Erreur lors de la création', 'error');
            }
          });
        }
      }
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.firstname} ${user.lastname} ?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.filterUsers();
          this.updateStats();
          this.showNotification('✅ Utilisateur supprimé avec succès', 'success');
        },
        error: (error) => {
          console.error('Erreur suppression:', error);
          this.showNotification('❌ Erreur lors de la suppression', 'error');
        }
      });
    }
  }

  openSubjectModal(subject?: Subject): void {
    this.editingSubject = subject || null;
    if (subject) {
      this.subjectForm.patchValue(subject);
    } else {
      this.subjectForm.reset();
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
          next: (updatedSubject) => {
            const index = this.subjects.findIndex(s => s.id === this.editingSubject!.id);
            if (index !== -1) {
              this.subjects[index] = updatedSubject;
            }
            this.updateStats();
            this.closeSubjectModal();
            this.showNotification('✅ Matière modifiée avec succès', 'success');
          },
          error: (error) => {
            console.error('Erreur lors de la modification de la matière:', error);
            this.showNotification('❌ Erreur lors de la modification', 'error');
          }
        });
      } else {
        this.subjectService.createSubject(subjectData).subscribe({
          next: (newSubject) => {
            this.subjects.push(newSubject);
            this.updateStats();
            this.closeSubjectModal();
            this.showNotification('✅ Matière créée avec succès', 'success');
          },
          error: (error) => {
            console.error('Erreur lors de la création de la matière:', error);
            this.showNotification('❌ Erreur lors de la création', 'error');
          }
        });
      }
    }
  }

  generateBulkTranscripts(): void {
    const students = this.users.filter(u => u.role === Role.STUDENT);
    students.forEach(student => {
      this.transcriptService.generateStudentTranscript(student.username).subscribe({
        next: (blob) => {
          this.transcriptService.downloadTranscript(blob, student.username);
        },
        error: (error) => console.error('Erreur génération relevé:', error)
      });
    });
    this.showNotification('📑 Génération des relevés terminée', 'success');
  }

  exportToExcel(): void {
    this.exportService.exportGradesToExcel().subscribe({
      next: (blob) => {
        this.exportService.downloadExcel(blob, 'rapport_notes.xlsx');
        this.showNotification('✅ Export Excel téléchargé avec succès', 'success');
      },
      error: (error) => {
        this.showNotification('❌ Erreur lors de l\'export Excel', 'error');
      }
    });
  }

  getRoleLabel(role: Role): string {
    switch (role) {
      case Role.ADMIN: return 'Administrateur';
      case Role.TEACHER: return 'Enseignant';
      case Role.STUDENT: return 'Étudiant';
      default: return role;
    }
  }

  getRoleColor(role: Role): string {
    switch (role) {
      case Role.ADMIN: return 'bg-red-100 text-red-800';
      case Role.TEACHER: return 'bg-blue-100 text-blue-800';
      case Role.STUDENT: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getInitials(firstname: string, lastname: string): string {
    if (!firstname || !lastname || !firstname.trim() || !lastname.trim()) {
      return '??';
    }
    return (firstname.charAt(0) + lastname.charAt(0)).toUpperCase();
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.notificationApiService.createNotification({
      title: type === 'success' ? 'Succès' : type === 'error' ? 'Erreur' : 'Information',
      message: message,
      type: type
    }).subscribe();
    console.log(`${type.toUpperCase()}: ${message}`);
  }

  private generateStudentId(): string {
    const timestamp = Date.now().toString().slice(-4);
    return `S${timestamp}`;
  }

  onRoleChange(): void {
    const role = this.userForm.get('role')?.value;
    if (role === 'STUDENT') {
      this.userForm.get('classId')?.setValidators([Validators.required]);
    } else {
      this.userForm.get('classId')?.clearValidators();
    }
    this.userForm.get('classId')?.updateValueAndValidity();
  }

  private generateTeacherId(): string {
    const timestamp = Date.now().toString().slice(-4);
    return `T${timestamp}`;
  }
  


  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}