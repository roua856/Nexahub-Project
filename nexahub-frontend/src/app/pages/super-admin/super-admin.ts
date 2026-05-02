import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-super-admin',
  imports: [CommonModule],
  templateUrl: './super-admin.html',
  styleUrl: './super-admin.scss'
})
export class SuperAdmin implements OnInit {

  user: any;
  companies: any[] = [];
  totalUsers = 0;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8080/api/companies').subscribe({
      next: (data) => {
        this.companies = data;
        this.totalUsers = data.reduce((sum, c) => sum + c.totalUsers, 0);
      },
      error: () => console.log('Error loading companies')
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}