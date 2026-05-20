import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss'
})
export class Notifications implements OnInit {
  notifications: any[] = [];

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.notificationService.getAll().subscribe({
      next: (data) => {
        this.notifications = data;
        this.cdr.detectChanges();
      }
    });
    this.notificationService.markRead().subscribe();
  }
}