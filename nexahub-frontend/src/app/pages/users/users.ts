import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { UserService } from '../../services/user';
import { RoleService } from '../../services/role';
import { AuthService } from '../../services/auth';
import { Utilisateur, Role } from '../../models/models';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {

  users: Utilisateur[] = [];
  roles: Role[] = [];
  selectedUser: Utilisateur | null = null;
  showInviteModal = false;
  showEditModal = false;
  loading = false;
  inviteLoading = false;
  inviteError = '';

  inviteData = { nom: '', email: '', motDePasse: '', roleId: '' };
  editData: any = { nom: '', roleId: 0, actif: true };

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.roleService.getAll().subscribe(r => {
      this.roles = r.filter(role =>
        role.nom !== 'SUPER_ADMIN' && role.nom !== 'USER'
      );
    });
  }

  loadUsers(): void {
    const company = this.authService.getCompany();
    this.userService.getByCompany(company).subscribe({
      next: (u) => this.users = u,
      error: () => console.log('Error loading users')
    });
  }

  openInvite(): void {
    this.inviteData = { nom: '', email: '', motDePasse: '', roleId: '' };
    this.inviteError = '';
    this.showInviteModal = true;
  }

  inviteUser(): void {
    if (!this.inviteData.nom ||
        !this.inviteData.email ||
        !this.inviteData.motDePasse) {
      this.inviteError = 'Please fill all fields';
      return;
    }
    this.inviteLoading = true;
    this.inviteError = '';
    const payload = {
      nom: this.inviteData.nom,
      email: this.inviteData.email,
      motDePasse: this.inviteData.motDePasse,
      company: this.authService.getCompany()
    };
    this.userService.invite(payload).subscribe({
      next: (newUser) => {
        if (this.inviteData.roleId) {
          this.userService.update(newUser.id, {
            nom: newUser.nom,
            roleId: parseInt(this.inviteData.roleId),
            actif: true
          }).subscribe(() => this.loadUsers());
        } else {
          this.loadUsers();
        }
        this.showInviteModal = false;
        this.inviteLoading = false;
      },
      error: () => {
        this.inviteError = 'Failed. Email may already exist.';
        this.inviteLoading = false;
      }
    });
  }

  openEdit(user: Utilisateur): void {
    this.selectedUser = user;
    this.editData = {
      nom: user.nom,
      roleId: user.role?.id || 0,
      actif: user.actif
    };
    this.showEditModal = true;
  }

  saveUser(): void {
    if (!this.selectedUser) return;
    this.loading = true;
    this.userService.update(this.selectedUser.id, this.editData).subscribe({
      next: () => {
        this.loadUsers();
        this.showEditModal = false;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(id).subscribe(() => this.loadUsers());
    }
  }

  getRoleBadge(role: any): string {
    if (!role) return 'badge-role badge-user';
    const n = role.nom?.toUpperCase();
    if (n === 'ADMIN' || n === 'SUPER_ADMIN') return 'badge-role badge-admin';
    if (n === 'MANAGER') return 'badge-role badge-manager';
    return 'badge-role badge-user';
  }
}