import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { User, Role, StudentRequest, TeacherRequest } from '../../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold">👥 Gestion des Comptes</h3>
        <button (click)="openUserModal()" class="btn-primary">
          ➕ Nouvel Utilisateur
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let user of users">
              <td class="px-6 py-4 whitespace-nowrap">{{ user.firstname }} {{ user.lastname }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.role }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button (click)="deleteUser(user)" class="text-red-600 hover:text-red-900">
                  🗑️ Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  
  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => this.users = users,
      error: (error) => console.error('Erreur:', error)
    });
  }
  
  openUserModal(): void {
    // TODO: Implémenter modal
  }
  
  deleteUser(user: User): void {
    if (confirm(`Supprimer ${user.firstname} ${user.lastname} ?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => this.loadUsers(),
        error: (error) => console.error('Erreur:', error)
      });
    }
  }
}