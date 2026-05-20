import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { RoleService } from '../../services/role';
import { HistoriqueService } from '../../services/historique';
import { TaskService } from '../../services/task';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SidebarComponent, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
 
  user: any;
  showProfileMenu = false;
  showNotifications = false;

  totalUsers = 0;
  activeUsers = 0;
  totalRoles = 0;
  blockedUsers = 0;
  actionsToday = 0;

  unreadCount = 0;
  notifications: any[] = [];

  recentActions: any[] = [];
  recentTasks: any[] = [];

  myTasks: any[] = [];
  completedTasks = 0;
  progressTasks = 0;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private historiqueService: HistoriqueService,
    private taskService: TaskService,
    private notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {

    if (this.authService.isEmployee()) {
      this.loadMyTasks();
    } else {
      this.loadAdminData();
    }

    this.loadNotifications();
  }

  loadAdminData(): void {

    this.userService.getByCompany(this.user.company).subscribe({
      next: (users) => {

        this.totalUsers = users.length;

        this.blockedUsers =
          users.filter(u => !u.actif).length;

        this.activeUsers =
          users.filter(u => u.actif).length;

        this.cdr.detectChanges();
      }
    });

    this.roleService.getAll().subscribe({
      next: (roles) => {

        this.totalRoles = roles.filter(r =>
          r.nom !== 'SUPER_ADMIN'
          && r.nom !== 'USER'
        ).length;

        this.cdr.detectChanges();
      }
    });

    this.historiqueService
      .getByCompany(this.user.company)
      .subscribe({

      next: (actions) => {

        const today =
          new Date().toDateString();

        this.actionsToday =
          actions.filter(a =>
            new Date(a.dateAction)
              .toDateString() === today
          ).length;

        this.recentActions =
          actions.slice(0, 5);

        this.cdr.detectChanges();
      }
    });

    this.taskService.getAll().subscribe({
      next: (tasks) => {

        this.recentTasks =
          tasks.slice(0, 5);

        this.cdr.detectChanges();
      }
    });
  }

  loadMyTasks(): void {

    this.taskService.getMyTasks().subscribe({
      next: (tasks) => {

        this.myTasks = tasks;

        this.completedTasks =
          tasks.filter(t =>
            t.status === 'DONE'
          ).length;

        this.progressTasks =
          tasks.filter(t =>
            t.status === 'IN_PROGRESS'
          ).length;

        this.recentTasks =
          tasks.slice(0, 5);

        this.cdr.detectChanges();
      }
    });
  }

  loadNotifications(): void {
  this.notificationService.getAll().subscribe({
    next: (data) => {
      this.notifications = data.slice(0, 10);
      this.unreadCount = data.filter((n: any) => !n.read).length;
      this.cdr.detectChanges();
    }
  });
}

  toggleNotifications(): void {
    this.router.navigate(['/notifications']);
    this.notificationService.markRead().subscribe({
      next: () => { this.unreadCount = 0; }
    });
  }
  getBadgeClass(action: string): string {

    switch (action) {

      case 'LOGIN':
        return 'badge bg-primary';

      case 'REGISTER':
        return 'badge bg-success';

      case 'CREATE':
        return 'badge bg-success';

      case 'DELETE':
        return 'badge bg-danger';

      case 'BLOCK':
        return 'badge bg-warning';

      case 'ROLE_CHANGE':
        return 'badge bg-info';

      default:
        return 'badge bg-secondary';
    }
  }

  getPriorityClass(priority: string): string {

    switch (priority) {

      case 'HIGH':
        return 'badge bg-high';

      case 'MEDIUM':
        return 'badge bg-warning';

      case 'LOW':
        return 'badge bg-low';

      default:
        return 'badge bg-secondary';
    }
  }

  getStatusClass(status: string): string {

    switch (status) {

      case 'DONE':
        return 'badge bg-success';

      case 'IN_PROGRESS':
        return 'badge bg-inprogress';

      default:
        return 'badge bg-secondary';
    }
  }

  isEmployee(): boolean {
    return this.authService.getRole() === 'EMPLOYEE';
  }

  getAvatarStyle(name: string): object {

    const colors = [

      {
        background: '#dbeafe',
        color: '#2563eb'
      },

      {
        background: '#dcfce7',
        color: '#16a34a'
      },

      {
        background: '#fce7f3',
        color: '#be185d'
      },

      {
        background: '#ede9fe',
        color: '#7c3aed'
      },

      {
        background: '#fef3c7',
        color: '#d97706'
      },

      {
        background: '#e0f2fe',
        color: '#0369a1'
      },

      {
        background: '#f3e8ff',
        color: '#9333ea'
      },

      {
        background: '#ffedd5',
        color: '#ea580c'
      },

    ];

    if (!name) {

      return {
        background: '#dbeafe',
        color: '#2563eb'
      };

    }

    const index =
      name.charCodeAt(0) % colors.length;

    return colors[index];
  }

}