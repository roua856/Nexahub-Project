import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { RoleService } from '../../services/role';
import { PermissionService } from '../../services/permission';
import { Role, Permission } from '../../models/models';

@Component({
  selector: 'app-roles',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './roles.html',
  styleUrl: './roles.scss'
})
export class Roles implements OnInit {

  roles: Role[] = [];
  permissions: Permission[] = [];
  selectedRole: Role | null = null;
  selectedPermissions: number[] = [];
  showCreateRole = false;
  showCreatePermission = false;
  saveMessage = '';
  newRole = { nom: '', description: '' };
  newPermission = { nom: '', description: '' };

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe(r => {
      this.roles = r.filter(role =>
        role.nom !== 'SUPER_ADMIN' && role.nom !== 'USER'
      );
    });
  }

  loadPermissions(): void {
    this.permissionService.getAll().subscribe(p => this.permissions = p);
  }

  selectRole(role: Role): void {
    this.selectedRole = role;
    this.selectedPermissions = role.permissions?.map(p => p.id) || [];
    this.saveMessage = '';
  }

  createRole(): void {
    if (!this.newRole.nom) return;
    this.roleService.create(this.newRole).subscribe(() => {
      this.loadRoles();
      this.showCreateRole = false;
      this.newRole = { nom: '', description: '' };
    });
  }

  createPermission(): void {
    if (!this.newPermission.nom) return;
    this.permissionService.create(this.newPermission).subscribe(() => {
      this.loadPermissions();
      this.showCreatePermission = false;
      this.newPermission = { nom: '', description: '' };
    });
  }

  togglePermission(permId: number): void {
    const index = this.selectedPermissions.indexOf(permId);
    if (index > -1) {
      this.selectedPermissions.splice(index, 1);
    } else {
      this.selectedPermissions.push(permId);
    }
  }

  hasPermission(permId: number): boolean {
    return this.selectedPermissions.includes(permId);
  }

  savePermissions(): void {
    if (!this.selectedRole) return;
    this.roleService.assignPermissions(
      this.selectedRole.id,
      this.selectedPermissions
    ).subscribe(() => {
      this.saveMessage = 'Permissions saved successfully!';
      this.loadRoles();
      setTimeout(() => this.saveMessage = '', 3000);
    });
  }

  deleteRole(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Delete this role?')) {
      this.roleService.delete(id).subscribe(() => {
        if (this.selectedRole?.id === id) this.selectedRole = null;
        this.loadRoles();
      });
    }
  }

  getRoleClass(nom: string): string {
    const n = nom?.toUpperCase();
    if (n === 'ADMIN') return 'badge-role badge-admin';
    if (n === 'MANAGER') return 'badge-role badge-manager';
    if (n === 'GUEST') return 'badge-role badge-guest';
    return 'badge-role badge-user';
  }
}