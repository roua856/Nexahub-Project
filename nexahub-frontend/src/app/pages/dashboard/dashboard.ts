import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { RoleService } from '../../services/role';
import { HistoriqueService } from '../../services/historique';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SidebarComponent, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  user: any;
  totalUsers = 0;
  activeUsers = 0;
  totalRoles = 0;
  blockedUsers = 0;
  actionsToday = 0;
  recentActions: any[] = [];
  recentTasks: any[] = [];

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private historiqueService: HistoriqueService,
    private taskService: TaskService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
        this.activeUsers = users.filter(u => u.actif).length;
        this.cdr.detectChanges();
      }
    });

    this.roleService.getAll().subscribe({
      next: (roles) => {
        this.totalRoles = roles.filter(r =>
          r.nom !== 'SUPER_ADMIN' && r.nom !== 'USER'
        ).length;
        this.cdr.detectChanges();
      }
    });

    this.historiqueService.getByCompany(this.user.company).subscribe({
      next: (actions) => {
        const today = new Date().toDateString();
        this.actionsToday = actions.filter(a =>
          new Date(a.dateAction).toDateString() === today
        ).length;
        this.recentActions = actions.slice(0, 5);
        this.cdr.detectChanges();
      }
    });

    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.recentTasks = tasks.slice(0, 5);
        this.cdr.detectChanges();
      }
    });
  }


 getPriorityClass(priority: string): string {
  switch (priority) {
    case 'HIGH':   return 'badge bg-high';
    case 'MEDIUM': return 'badge bg-warning';
    case 'LOW':    return 'badge bg-low';
    default:       return 'badge bg-secondary';
  }
}

  getStatusClass(status: string): string {
  switch (status) {
    case 'DONE':        return 'badge bg-success';
    case 'IN_PROGRESS': return 'badge bg-inprogress';
    default:            return 'badge bg-secondary';
  }
}
getBadgeClass(action: string): string {
  switch (action) {
    case 'LOGIN':        return 'badge bg-primary';
    case 'REGISTER':     return 'badge bg-success';
    case 'CREATE':       return 'badge bg-success';
    case 'TASK_CREATE':  return 'badge bg-info';
    case 'TASK_UPDATE':  return 'badge bg-inprogress';
    case 'DELETE':       return 'badge bg-danger';
    case 'BLOCK':        return 'badge bg-warning';
    case 'ROLE_CHANGE':  return 'badge bg-info';
    default:             return 'badge bg-secondary';
  }
}
  isEmployee(): boolean {
    return this.authService.getRole() === 'EMPLOYEE';
  }
}