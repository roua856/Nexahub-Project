import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../components/sidebar/sidebar';
import { UserService } from '../../services/user';
import { RoleService } from '../../services/role';
import { AuthService } from '../../services/auth';

import { Utilisateur, Role } from '../../models/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
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

  selectedTab: string = 'ALL';
  searchText: string = '';
  currentPage: number = 1;

 itemsPerPage: number = 5;

  inviteData = {
    nom: '',
    email: '',
    motDePasse: '',
    roleId: ''
  };

  editData: any = {
    nom: '',
    roleId: 0,
    actif: true
  };

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadUsers();

    this.roleService.getAll().subscribe({
      next: (roles) => {

        this.roles = roles.filter(role =>
          role.nom !== 'SUPER_ADMIN' &&
          role.nom !== 'USER'
        );

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  // LOAD USERS

  loadUsers(): void {

    const company = this.authService.getCompany();

    this.userService.getByCompany(company).subscribe({

      next: (users) => {

        this.users = users;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log('Error loading users', err);
      }

    });

  }

  // INVITE MODAL

  openInvite(): void {

    this.inviteData = {
      nom: '',
      email: '',
      motDePasse: '',
      roleId: ''
    };

    this.inviteError = '';

    this.showInviteModal = true;
  }

  // INVITE USER

  inviteUser(): void {

    if (
      !this.inviteData.nom ||
      !this.inviteData.email ||
      !this.inviteData.motDePasse
    ) {

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

      next: (newUser: any) => {

        // UPDATE ROLE AFTER CREATION

        if (this.inviteData.roleId) {

          this.userService.update(newUser.id, {

            nom: newUser.nom,

            roleId: parseInt(this.inviteData.roleId),

            actif: true

          }).subscribe({

            next: () => {
              this.loadUsers();
            }

          });

        } else {

          this.loadUsers();
        }

        this.showInviteModal = false;

        this.inviteLoading = false;
      },

      error: () => {

        this.inviteError =
          'Failed. Email may already exist.';

        this.inviteLoading = false;
      }

    });

  }

  // OPEN EDIT MODAL

  openEditModal(user: Utilisateur): void {

    this.selectedUser = user;

    this.editData = {

      nom: user.nom,

      roleId: user.role?.id || 0,

      actif: user.actif

    };

    this.showEditModal = true;
  }

  // SAVE USER

  saveUser(): void {

    if (!this.selectedUser) {
      return;
    }

    this.loading = true;

    this.userService.update(
      this.selectedUser.id,
      this.editData
    ).subscribe({

      next: () => {

        this.loadUsers();

        this.showEditModal = false;

        this.loading = false;
      },

      error: () => {

        this.loading = false;
      }

    });

  }

  // BLOCK USER

  blockUser(id: number): void {

    if (confirm('Block this user ?')) {

      this.userService.update(id, {

        actif: false

      }).subscribe({

        next: () => {
          this.loadUsers();
        }

      });

    }

  }

  // ACTIVATE USER

  activateUser(id: number): void {

    this.userService.update(id, {

      actif: true

    }).subscribe({

      next: () => {
        this.loadUsers();
      }

    });

  }

  // DELETE USER

  deleteUser(id: number): void {

    if (confirm('Delete this user ?')) {

      this.userService.delete(id).subscribe({

        next: () => {
          this.loadUsers();
        }

      });

    }

  }

  // ROLE BADGES

  getRoleBadge(role: any): string {

    if (!role) {
      return 'badge-role badge-user';
    }

    const roleName = role.nom?.toUpperCase();

    if (
      roleName === 'ADMIN' ||
      roleName === 'SUPER_ADMIN'
    ) {

      return 'badge-role badge-admin';
    }

    if (roleName === 'MANAGER') {

      return 'badge-role badge-manager';
    }

    if (roleName === 'EMPLOYEE') {

      return 'badge-role badge-employee';
    }

    return 'badge-role badge-user';
  }

  // FILTER USERS

  getFilteredUsers(): Utilisateur[] {

    const filtered = this.users.filter(user => {

      const matchTab =

        this.selectedTab === 'ALL' ||

        (this.selectedTab === 'ACTIVE' && user.actif) ||

        (this.selectedTab === 'BLOCKED' && !user.actif);

      const matchSearch =

        user.nom.toLowerCase()
          .includes(this.searchText.toLowerCase()) ||

        user.email.toLowerCase()
          .includes(this.searchText.toLowerCase());

      return matchTab && matchSearch;
    });

    const start = (this.currentPage - 1) * this.itemsPerPage;

    const end = start + this.itemsPerPage;

    return filtered.slice(start, end);
 }
 getAvatarColor(name: string): any {

  const colors = [

    {
      background: '#dcfce7',
      color: '#16a34a'
    },

    {
      background: '#dbeafe',
      color: '#2563eb'
    },

    {
      background: '#fce7f3',
      color: '#db2777'
    },

    {
      background: '#fef3c7',
      color: '#d97706'
    },

    {
      background: '#ede9fe',
      color: '#7c3aed'
    },

    {
      background: '#cffafe',
      color: '#0891b2'
    }

  ];

  let index = 0;

  for(let i = 0; i < name.length; i++){

    index += name.charCodeAt(i);

  }

  return colors[index % colors.length];
 }
  getTotalPages(): number {

    return Math.ceil(

      this.users.filter(user => {

        const matchTab =

          this.selectedTab === 'ALL' ||

          (this.selectedTab === 'ACTIVE' && user.actif) ||

          (this.selectedTab === 'BLOCKED' && !user.actif);

        const matchSearch =

          user.nom.toLowerCase()
            .includes(this.searchText.toLowerCase()) ||

          user.email.toLowerCase()
            .includes(this.searchText.toLowerCase());

        return matchTab && matchSearch;

      }).length / this.itemsPerPage
    );
  }

  nextPage(): void {

    if(this.currentPage < this.getTotalPages()){

      this.currentPage++;

    }
  }

  previousPage(): void {

    if(this.currentPage > 1){

      this.currentPage--;

    }
  }

}
