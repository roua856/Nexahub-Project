import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { HistoriqueService } from '../../services/historique';
import { AuthService } from '../../services/auth';
import { HistoriqueAction } from '../../models/models';

@Component({
  selector: 'app-audit',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './audit.html',
  styleUrl: './audit.scss'
})
export class Audit implements OnInit {

  actions: HistoriqueAction[] = [];
  filtered: HistoriqueAction[] = [];
  selectedFilter = 'ALL';
  filters = ['ALL', 'LOGIN', 'REGISTER', 'CREATE',
             'DELETE', 'BLOCK', 'ROLE_CHANGE', 'PASSWORD_CHANGE'];

  constructor(
    private historiqueService: HistoriqueService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const company = this.authService.getCompany();
    this.historiqueService.getByCompany(company).subscribe({
      next: (data) => {
        this.actions = data;
        this.filtered = data;
        this.cdr.detectChanges();
      }
    });
  }

  filterBy(f: string): void {
    this.selectedFilter = f;
    this.filtered = f === 'ALL'
      ? this.actions
      : this.actions.filter(a => a.action === f);
    this.cdr.detectChanges();
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

  getBadgeClass(action: string): string {
    switch (action) {
      case 'LOGIN':           return 'badge bg-primary';
      case 'REGISTER':        return 'badge bg-success';
      case 'CREATE':          return 'badge bg-success';
      case 'DELETE':          return 'badge bg-danger';
      case 'BLOCK':           return 'badge bg-warning';
      case 'ROLE_CHANGE':     return 'badge bg-info';
      case 'PASSWORD_CHANGE': return 'badge bg-secondary';
      default:                return 'badge bg-secondary';
    }
  }

  exportCSV(): void {
    const headers = ['Date', 'User', 'Action', 'Details', 'Company'];
    const rows = this.filtered.map(a => [
      a.dateAction,
      a.utilisateur?.nom || '',
      a.action,
      a.details || '',
      a.company || ''
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'audit-log.csv';
    link.click();
  }
  searchText = '';

  onSearch(event: any): void {
    this.searchText = event.target.value.toLowerCase();

    this.filtered = this.actions.filter(a =>
      (a.utilisateur?.nom || '').toLowerCase().includes(this.searchText) &&
      (this.selectedFilter === 'ALL' || a.action === this.selectedFilter)
    );
  }
  getIcon(action: string): string {
    switch (action) {
      case 'LOGIN':           return '🔑';
      case 'REGISTER':        return '✅';
      case 'CREATE':          return '➕';
      case 'DELETE':          return '🗑';
      case 'BLOCK':           return '🚫';
      case 'ROLE_CHANGE':     return '🔄';
      case 'PASSWORD_CHANGE': return '🔐';
      default:                return '';
    }
  }

  
}