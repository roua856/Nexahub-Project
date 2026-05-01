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

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
  }

  isAdmin(): boolean {
    const role = this.authService.getRole();
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}