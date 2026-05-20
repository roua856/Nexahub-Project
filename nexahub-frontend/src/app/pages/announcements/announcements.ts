import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { AuthService } from '../../services/auth';
import { AnnouncementService } from '../../services/announcement';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './announcements.html',
  styleUrls: ['./announcements.scss']
})
export class Announcements implements OnInit {

  showForm = false;
  announcements: any[] = [];
  errorMsg = '';
  user: any;

  newAnn = {
    title: '',
    content: '',
    type: 'INFO'
  };

  constructor(
    public authService: AuthService,
    private announcementService: AnnouncementService,
    private notifService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.announcementService.getAll().subscribe({
      next: (data) => {
        this.announcements = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'Failed to load: ' + err.status + ' ' + err.message;
        this.cdr.detectChanges();
      }
    });
  }

  postAnnouncement(): void {

  if (!this.newAnn.title || !this.newAnn.content) {
    return;
  }

  this.announcementService.create(this.newAnn).subscribe({

    next: () => {

      const company = this.user.company;

      const allUsers =
        JSON.parse(localStorage.getItem('company_users') || '[]');

      allUsers
        .filter((u: any) =>
          u.company === company &&
          u.email !== this.user.email
        )
        .forEach((u: any) => {

          

        });

      this.newAnn = {
        title: '',
        content: '',
        type: 'INFO'
      };

      this.showForm = false;

      this.load();
    }

  });

}

  deleteAnnouncement(id: number): void {
    if (!confirm('Delete this announcement?')) return;
    this.announcementService.delete(id).subscribe({
      next: () => this.load(),
      error: (err) => console.error('DELETE failed:', err.status, err.error)
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'WARNING': return '⚠️';
      case 'SUCCESS': return '✅';
      default:        return 'ℹ️';
    }
  }

  getTypeBadge(type: string): string {
    switch (type) {
      case 'WARNING': return 'badge-warning';
      case 'SUCCESS': return 'badge-success';
      default:        return 'badge-info';
    }
  }

  getAvatarStyle(name: string): object {
    const colors = [
      { background: '#dbeafe', color: '#2563eb' },
      { background: '#dcfce7', color: '#16a34a' },
      { background: '#fce7f3', color: '#be185d' },
      { background: '#ede9fe', color: '#7c3aed' },
      { background: '#fef3c7', color: '#d97706' },
      { background: '#e0f2fe', color: '#0369a1' },
      { background: '#f3e8ff', color: '#9333ea' },
      { background: '#ffedd5', color: '#ea580c' },
    ];
    if (!name) return { background: '#dbeafe', color: '#2563eb' };
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }
}