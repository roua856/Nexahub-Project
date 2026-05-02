import { Component, OnInit } from '@angular/core';
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const company = this.authService.getCompany();
    this.historiqueService.getByCompany(company).subscribe({
      next: (data) => {
        this.actions = data;
        this.filtered = data;
      }
    });
  }

  filterBy(f: string): void {
    this.selectedFilter = f;
    this.filtered = f === 'ALL'
      ? this.actions
      : this.actions.filter(a => a.action === f);
  }

  getBadgeClass(action: string): string {
    switch (action) {
      case 'LOGIN': return 'badge bg-primary';
      case 'REGISTER': return 'badge bg-success';
      case 'CREATE': return 'badge bg-success';
      case 'DELETE': return 'badge bg-danger';
      case 'BLOCK': return 'badge bg-warning text-dark';
      case 'ROLE_CHANGE': return 'badge bg-info text-dark';
      case 'PASSWORD_CHANGE': return 'badge bg-secondary';
      default: return 'badge bg-secondary';
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
}