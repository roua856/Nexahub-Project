import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { AuthService } from '../../services/auth';
import { AnnouncementService } from '../../services/announcement';

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

  newAnn = {
    title: '',
    content: '',
    type: 'INFO'
  };

  constructor(
    public authService: AuthService,
    private announcementService: AnnouncementService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.announcementService.getAll().subscribe({
      next: (data) => {
        console.log('GET announcements OK:', data);
        this.announcements = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('GET announcements FAILED:', err);
        this.errorMsg = 'Failed to load: ' + err.status + ' ' + err.message;
        this.cdr.detectChanges();
      }
    });
  }

 postAnnouncement(): void {
    if (!this.newAnn.title || !this.newAnn.content) return;

    this.announcementService.create(this.newAnn).subscribe({
        next: () => {
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
 


}