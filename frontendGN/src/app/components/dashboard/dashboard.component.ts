import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SessionService, SessionInfo } from '../../services/session.service';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { NotificationService } from '../../services/notification.service';
import { StudentDashboardComponent } from '../student/student-dashboard.component';
import { TeacherDashboardComponent } from '../teacher/teacher-dashboard.component';
import { AdminDashboardComponent } from '../admin/admin-dashboard.component';
import { AdminUsersComponent } from '../admin/admin-users.component';
import { AdminSubjectsComponent } from '../admin/admin-subjects.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ChatComponent } from '../chat/chat.component';
import { MessagingComponent } from '../messaging/messaging.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { ClassManagementComponent } from '../class-management/class-management.component';
import { ToastComponent } from '../toast/toast.component';

import { AvatarService } from '../../services/avatar.service';
import { ProfilePhotoService } from '../../services/profile-photo.service';
import { ClassService, ClassModel } from '../../services/class.service';
import { TeacherClassService } from '../../services/teacher-class.service';
import { User, Role } from '../../models/user.model';

export interface SearchResult {
  type: 'user' | 'subject' | 'grade' | 'section';
  title: string;
  subtitle: string;
  id: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, StudentDashboardComponent, TeacherDashboardComponent, AdminDashboardComponent, AdminUsersComponent, AdminSubjectsComponent, NotificationsComponent, ChatComponent, MessagingComponent, ProfileModalComponent, ClassManagementComponent, ToastComponent],
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  sessionInfo: SessionInfo;
  activeSection = 'dashboard';
  showProfileModal = false;
  searchQuery = '';
  searchResults: SearchResult[] = [];
  classes: ClassModel[] = [];
  teacherClasses: any[] = [];
  selectedClassName = '';
  selectedSemester = 'S1';
  classStudents: any[] = [];
  studentGrades: any[] = [];
  showClassModal = false;
  classForm: FormGroup;
  showGradeModal = false;
  selectedStudent: any = null;
  gradeForm: FormGroup;
  private welcomeMessageShown = false;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router,
    private avatarService: AvatarService,
    private profilePhotoService: ProfilePhotoService,
    private classService: ClassService,
    private teacherClassService: TeacherClassService,
    private fb: FormBuilder,
    private userPreferencesService: UserPreferencesService,
    private notificationService: NotificationService
  ) {
    this.sessionInfo = this.sessionService.getSessionInfo();
    
    this.classForm = this.fb.group({
      name: ['', Validators.required],
      academicYear: ['2024-2025', Validators.required]
    });
    
    this.gradeForm = this.fb.group({
      subjectName: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      coefficient: [1, [Validators.required, Validators.min(0.5), Validators.max(5)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(authUser => {
      this.currentUser = authUser?.user || null;
      console.log('Dashboard - Current user:', this.currentUser);
      console.log('Dashboard - User role:', this.currentUser?.role);
      console.log('Dashboard - Is admin:', this.isAdmin());
      console.log('Dashboard - Is teacher:', this.isTeacher());
      console.log('Dashboard - Is student:', this.isStudent());
      
      // Charger les préférences utilisateur
      if (this.currentUser && !this.welcomeMessageShown) {
        this.welcomeMessageShown = true;
        const preferences = this.userPreferencesService.loadPreferences(this.currentUser.id);
        if (preferences) {
          this.activeSection = preferences.activeSection;
          // Notification de bienvenue
          this.notificationService.info(
            'Bon retour !',
            `Bonjour ${this.currentUser.firstname}, dernière connexion: ${new Date(preferences.lastLogin).toLocaleString()}`
          );
        } else {
          // Première connexion
          this.notificationService.success(
            'Bienvenue !',
            `Bonjour ${this.currentUser.firstname}, bienvenue dans l'application de gestion des notes.`
          );
        }
      }
    });

    this.sessionService.sessionInfo$.subscribe(info => {
      this.sessionInfo = info;
    });
  }

  isStudent(): boolean {
    return this.currentUser?.role === Role.STUDENT;
  }

  isTeacher(): boolean {
    return this.currentUser?.role === Role.TEACHER;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === Role.ADMIN;
  }



  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getRoleDisplayName(role: Role | undefined): string {
    if (!role) return 'Utilisateur';
    switch (role) {
      case Role.ADMIN: return 'Administrateur';
      case Role.TEACHER: return 'Enseignant';
      case Role.STUDENT: return 'Étudiant';
      default: return 'Utilisateur';
    }
  }

  getInitials(firstname: string | undefined, lastname: string | undefined): string {
    if (!firstname || !lastname) return 'U';
    return (firstname.charAt(0) + lastname.charAt(0)).toUpperCase();
  }

  getAvatarUrl(firstname: string | undefined, lastname: string | undefined): string {
    // Vérifier s'il y a une photo uploadée pour l'utilisateur actuel
    if (this.currentUser) {
      const savedPhoto = this.profilePhotoService.getPhoto(this.currentUser.id);
      if (savedPhoto) {
        return savedPhoto;
      }
    }
    
    // Sinon, utiliser l'avatar généré
    if (!firstname || !lastname) return this.avatarService.generateAvatar('User', 'Default');
    return this.avatarService.generateAvatar(firstname, lastname);
  }

  openProfileModal(): void {
    this.showProfileModal = true;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  saveProfile(updatedUser: User): void {
    if (!this.currentUser) return;
    
    // Mettre à jour l'utilisateur localement
    this.currentUser = updatedUser;
    
    // Mettre à jour dans le service d'authentification
    this.authService.updateCurrentUser(updatedUser);
    
    // Notification de succès
    this.notificationService.success(
      'Profil mis à jour',
      'Vos informations personnelles ont été sauvegardées avec succès.'
    );
    
    // TODO: Implémenter l'appel API quand le service sera disponible
    
    this.closeProfileModal();
  }

  onSearch(event: any): void {
    const query = event.target.value.toLowerCase().trim();
    this.searchQuery = query;
    
    if (query.length < 2) {
      this.searchResults = [];
      return;
    }

    this.searchResults = [];
    
    // Recherche dans les sections accessibles selon le rôle
    const allSections: SearchResult[] = [
      { type: 'section', title: 'Tableau de bord', subtitle: 'Vue d\'ensemble', id: 'dashboard' },
      { type: 'section', title: 'Gestion des utilisateurs', subtitle: 'Admin - Utilisateurs', id: 'utilisateurs' },
      { type: 'section', title: 'Matières', subtitle: 'Admin - Matières', id: 'matieres' },
      { type: 'section', title: 'Classes', subtitle: 'Admin - Classes', id: 'classes' },
      { type: 'section', title: 'Mes Classes', subtitle: 'Enseignant - Classes', id: 'mes-classes' },
      { type: 'section', title: 'Saisir Notes', subtitle: 'Enseignant - Notes', id: 'saisie' },
      { type: 'section', title: 'Mes Notes', subtitle: 'Étudiant - Notes', id: 'notes' },
      { type: 'section', title: 'Messagerie', subtitle: 'Communications', id: 'messagerie' }
    ];

    const accessibleSections = allSections.filter(section => this.canAccessSection(section.id));
    const filteredSections = accessibleSections.filter(section => 
      section.title.toLowerCase().includes(query) || 
      section.subtitle.toLowerCase().includes(query)
    );
    
    this.searchResults = [...filteredSections].slice(0, 5);
  }

  selectSearchResult(result: SearchResult): void {
    if (result.type === 'section') {
      this.setActiveSection(result.id);
    }
    this.searchQuery = '';
    this.searchResults = [];
  }
  
  private canAccessSection(sectionId: string): boolean {
    switch (sectionId) {
      case 'utilisateurs':
      case 'matieres':
      case 'classes':
        return this.isAdmin();
      case 'mes-classes':
      case 'saisie':
        return this.isTeacher();
      case 'notes':
        return this.isStudent();
      case 'dashboard':
      case 'messagerie':
        return true;
      default:
        return false;
    }
  }

  getResultIcon(type: string): string {
    switch (type) {
      case 'user': return '👤';
      case 'subject': return '📚';
      case 'grade': return '📊';
      case 'section': return '📂';
      default: return '🔍';
    }
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    
    // Charger les données selon la section
    if (section === 'classes' && this.isAdmin()) {
      this.loadClasses();
    } else if (section === 'mes-classes' && this.isTeacher()) {
      this.loadTeacherClasses();
    }
    
    // Sauvegarder la section active
    if (this.currentUser) {
      const preferences = this.userPreferencesService.loadPreferences(this.currentUser.id) || {
        activeSection: section,
        notifications: [],
        lastLogin: new Date().toISOString()
      };
      preferences.activeSection = section;
      this.userPreferencesService.savePreferences(this.currentUser.id, preferences);
    }
  }
  
  loadClasses(): void {
    this.classService.getAllClasses().subscribe({
      next: (classes) => this.classes = classes,
      error: (error) => console.error('Erreur chargement classes:', error)
    });
  }
  
  openClassModal(): void {
    this.showClassModal = true;
    this.classForm.reset({ academicYear: '2024-2025' });
  }
  
  closeClassModal(): void {
    this.showClassModal = false;
  }
  
  onSubmitClass(): void {
    if (this.classForm.valid) {
      this.classService.createClass(this.classForm.value).subscribe({
        next: () => {
          this.loadClasses();
          this.closeClassModal();
        },
        error: (error) => console.error('Erreur création classe:', error)
      });
    }
  }
  
  editClass(classItem: ClassModel): void {
    const name = prompt('Nouveau nom:', classItem.name);
    const year = prompt('Nouvelle année:', classItem.academicYear);
    if (name && year && classItem.id) {
      this.classService.updateClass(classItem.id, { name, academicYear: year }).subscribe({
        next: () => this.loadClasses(),
        error: (error) => console.error('Erreur modification classe:', error)
      });
    }
  }
  
  deleteClass(classItem: ClassModel): void {
    if (confirm(`Supprimer la classe ${classItem.name} ?`) && classItem.id) {
      this.classService.deleteClass(classItem.id).subscribe({
        next: () => this.loadClasses(),
        error: (error) => console.error('Erreur suppression classe:', error)
      });
    }
  }
  
  loadTeacherClasses(): void {
    if (this.currentUser?.id) {
      console.log('Loading classes for teacher ID:', this.currentUser.id);
      this.teacherClassService.getTeacherClasses(this.currentUser.id.toString()).subscribe({
        next: (classes) => this.teacherClasses = classes,
        error: (error) => {
          console.error('Erreur chargement classes enseignant:', error);
          // Fallback avec données temporaires
          this.teacherClasses = [
            { className: '3A', academicYear: '2024-2025', studentCount: 25 },
            { className: '3B', academicYear: '2024-2025', studentCount: 23 },
            { className: '4A', academicYear: '2024-2025', studentCount: 27 }
          ];
        }
      });
    }
  }
  
  selectClass(teacherClass: any): void {
    this.selectedClassName = teacherClass.className;
    this.loadClassStudents(teacherClass.className);
    this.setActiveSection('class-grades');
  }
  
  loadClassStudents(className: string): void {
    // TODO: Implémenter l'API pour récupérer les étudiants d'une classe
    // Fallback temporaire
    this.classStudents = [
      { id: 1, firstname: 'Alice', lastname: 'Durand', studentId: 'STU001' },
      { id: 2, firstname: 'Bob', lastname: 'Martin', studentId: 'STU002' },
      { id: 3, firstname: 'Claire', lastname: 'Bernard', studentId: 'STU003' }
    ];
  }
  

  
  openGradeModal(student: any): void {
    this.selectedStudent = student;
    this.showGradeModal = true;
    this.gradeForm.reset({ coefficient: 1 });
  }
  
  closeGradeModal(): void {
    this.showGradeModal = false;
    this.selectedStudent = null;
  }
  
  onSubmitGrade(): void {
    if (this.gradeForm.valid && this.selectedStudent) {
      const formValue = this.gradeForm.value;
      const newGrade = {
        studentId: this.selectedStudent.id,
        subjectName: formValue.subjectName,
        value: parseFloat(formValue.value),
        coefficient: formValue.coefficient,
        comment: formValue.comment,
        semester: this.selectedSemester,
        className: this.selectedClassName
      };
      this.studentGrades.push(newGrade);
      this.closeGradeModal();
    }
  }
  
  getStudentGrades(studentId: number): any[] {
    return this.studentGrades.filter(g => g.studentId === studentId && g.semester === this.selectedSemester);
  }
  
  getGradeColor(value: number): string {
    if (value >= 16) return 'text-green-600';
    if (value >= 14) return 'text-blue-600';
    if (value >= 10) return 'text-yellow-600';
    return 'text-red-600';
  }

  getSectionTitle(): string {
    const userName = this.currentUser ? this.currentUser.firstname : 'Utilisateur';
    const userRole = this.currentUser ? this.getRoleDisplayName(this.currentUser.role) : '';
    
    switch (this.activeSection) {
      case 'dashboard': 
        if (this.isAdmin()) return `Tableau de bord Admin ${userName}`;
        if (this.isTeacher()) return `Tableau de bord Enseignant ${userName}`;
        if (this.isStudent()) return `Tableau de bord Élève ${userName}`;
        return `Tableau de bord ${userName}`;
      case 'notes': return `Mes Notes - ${userName}`;
      case 'saisie': return `Saisie des Notes - Prof ${userName}`;
      case 'utilisateurs': return `Gestion des Utilisateurs - Admin ${userName}`;
      case 'matieres': return `Gestion des Matières - Admin ${userName}`;
      case 'classes': return `Gestion des Classes - Admin ${userName}`;
      case 'mes-classes': return `Mes Classes - Prof ${userName}`;
      case 'messagerie': return `Messagerie - ${userName}`;
      default: return `Tableau de bord ${userName}`;
    }
  }
}