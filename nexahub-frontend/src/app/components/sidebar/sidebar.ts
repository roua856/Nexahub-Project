import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {

  user: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.getUser();
  }

  getRole(): string {
    return this.authService.getRole();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN' || this.getRole() === 'SUPER_ADMIN';
  }

  isAdminOrManager(): boolean {
    return this.isAdmin() || this.getRole() === 'MANAGER';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}