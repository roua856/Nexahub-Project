import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { UserService } from '../../services/user';
import { Utilisateur } from '../../models/models';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {

  user: Utilisateur | null = null;
  showPasswordForm = false;
  message = '';
  error = '';
  loading = false;

  passwordData = {
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirm: ''
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (u) => this.user = u,
      error: () => console.log('Error loading profile')
    });
  }

  getRoleBadge(): string {
    const n = this.user?.role?.nom?.toUpperCase();
    if (n === 'ADMIN' || n === 'SUPER_ADMIN') return 'badge-role badge-admin';
    if (n === 'MANAGER') return 'badge-role badge-manager';
    return 'badge-role badge-user';
  }

  changePassword(): void {
    if (!this.passwordData.ancienMotDePasse ||
        !this.passwordData.nouveauMotDePasse) {
      this.error = 'Please fill all fields';
      return;
    }
    if (this.passwordData.nouveauMotDePasse !== this.passwordData.confirm) {
      this.error = 'Passwords do not match';
      return;
    }
    this.loading = true;
    this.userService.changePassword({
      ancienMotDePasse: this.passwordData.ancienMotDePasse,
      nouveauMotDePasse: this.passwordData.nouveauMotDePasse
    }).subscribe({
      next: () => {
        this.message = 'Password changed successfully!';
        this.error = '';
        this.showPasswordForm = false;
        this.loading = false;
        this.passwordData = {
          ancienMotDePasse: '',
          nouveauMotDePasse: '',
          confirm: ''
        };
      },
      error: () => {
        this.error = 'Current password is incorrect';
        this.loading = false;
      }
    });
  }
}