import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../components/sidebar/sidebar';
import { TaskService } from '../../services/task';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-tasks',
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class Tasks implements OnInit {

  tasks: any[] = [];
  users: any[] = [];

  myTasks: any[] = [];

  user: any;

  loading = false;
  showForm = false;

  newTask = {
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    assignedTo: null
  };

  constructor(
    public authService: AuthService,
    private taskService: TaskService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {

    if (this.authService.isEmployee()) {

      this.loadMyTasks();

    } else {

      this.loadAllTasks();
      this.loadUsers();
    }
  }

  loadAllTasks(): void {

    this.taskService.getAll().subscribe({
      next: (data) => {

        this.tasks = data || [];
        this.myTasks = data || [];

        this.cdr.detectChanges();
      }
    });
  }

  loadMyTasks(): void {

    this.taskService.getMyTasks().subscribe({
      next: (data) => {

        this.myTasks = data;
        this.tasks = data;
        console.log(this.tasks);

        this.cdr.detectChanges();
      }
    });
  }

  loadUsers(): void {

    this.userService.getByCompany(this.user.company).subscribe({
      next: (data) => {

        this.users = data.filter(
          (u: any) => u.role?.nom === 'EMPLOYEE'
        );

        this.cdr.detectChanges();
      }
    });
  }

  createTask(): void {

    if (!this.newTask.title || !this.newTask.assignedTo) {
      return;
    }

    this.loading = true;

    this.taskService.create(this.newTask as any).subscribe({
      next: () => {

        this.newTask = {
          title: '',
          description: '',
          priority: 'MEDIUM',
          dueDate: '',
          assignedTo: null
        };

        this.loading = false;

        this.loadAllTasks();
      }
    });
  }

  updateStatus(taskId: number, status: string): void {

    this.taskService.updateStatus(taskId, status).subscribe({
      next: () => {

        if (this.authService.isEmployee()) {
          this.loadMyTasks();
        } else {
          this.loadAllTasks();
        }
      }
    });
  }

  setInProgress(taskId: number): void {
    this.updateStatus(taskId, 'IN_PROGRESS');
  }

  setDone(taskId: number): void {
    this.updateStatus(taskId, 'DONE');
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

  getFilteredTasks() {
  if (this.authService.isEmployee()) {
    return this.tasks.filter(
      task => task.assignedTo?.id === this.user?.id
    );
  }
  return this.tasks;
 }
    getTodoTasks() {
    return this.tasks.filter(task =>
        task.status?.toUpperCase() === 'TODO' ||
        task.status?.toUpperCase() === 'TO_DO'
    );
    }

    getInProgressTasks() {
    return this.tasks.filter(task =>
        task.status?.toUpperCase() === 'IN_PROGRESS' ||
        task.status?.toUpperCase() === 'INPROGRESS'
    );
    }

    getDoneTasks() {
    return this.tasks.filter(task =>
        task.status?.toUpperCase() === 'DONE'
    );
    }
}