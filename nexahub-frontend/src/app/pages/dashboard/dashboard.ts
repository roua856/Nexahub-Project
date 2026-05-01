import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { RoleService } from '../../services/role';
import { HistoriqueService } from '../../services/historique';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  user: any;
  totalUsers = 0;
  totalRoles = 0;
  blockedUsers = 0;
  actionsToday = 0;
  recentActions: any[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private historiqueService: HistoriqueService,
    private router: Router
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    if (this.authService.getRole() === 'SUPER_ADMIN') {
      this.router.navigate(['/super-admin']);
      return;
    }
    this.userService.getByCompany(this.user.company).subscribe({
      next: (users) => {
        this.totalUsers = users.length;
        this.blockedUsers = users.filter(u => !u.actif).length;
      }
    });
    this.roleService.getAll().subscribe({
      next: (roles) => this.totalRoles = roles.length
    });
    this.historiqueService.getByCompany(this.user.company).subscribe({
      next: (actions) => {
        this.recentActions = actions.slice(0, 5);
        this.actionsToday = actions.length;
      }
    });
  }

  getBadgeClass(action: string): string {
    switch (action) {
      case 'LOGIN': return 'badge bg-primary';
      case 'REGISTER': return 'badge bg-success';
      case 'CREATE': return 'badge bg-success';
      case 'DELETE': return 'badge bg-danger';
      case 'BLOCK': return 'badge bg-warning text-dark';
      case 'ROLE_CHANGE': return 'badge bg-info text-dark';
      default: return 'badge bg-secondary';
    }
  }
}